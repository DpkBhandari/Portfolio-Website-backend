import {
  registerUserValidator,
  loginUserValidator,
} from "../Validator/user.validator.js";
import { sendResponse } from "../utils/sendResponse.js";
import { hashing, compare } from "../utils/helpers.js";
import User from "../Model/user.model.js";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtToken.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Changed from "strict" to "none" for cross-origin
  path: "/",
};

const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Register a new admin user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function registerUser(req, res, next) {
  try {
    // Input validation
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || "Invalid credentials";
      return sendResponse(res, 400, errorMessage);
    }

    const { name, email, password } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return sendResponse(res, 409, "User already exists");
    }

    // Hash password
    const hashedPassword = await hashing(password);

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    return sendResponse(res, 201, "Admin registered successfully", {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return next(error);
  }
}

/**
 * Login admin user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function loginUser(req, res, next) {
  try {
    // Input validation
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) {
      const errorMessage = error.details[0]?.message || "Invalid credentials";
      return sendResponse(res, 400, errorMessage);
    }

    const { email, password } = value;

    // Find admin user
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    }).select("+password");

    if (!user) {
      return sendResponse(res, 401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, "Invalid credentials");
    }

    // Create user payload for tokens
    const userPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Set secure cookies
    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
    });

    res.cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
    });

    // Update last login time
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    // Log successful login (exclude sensitive data)
    console.log(
      `Admin login successful: ${user.email} at ${new Date().toISOString()}`
    );

    return sendResponse(res, 200, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: new Date(),
      },
      // Return tokens for development/debugging
      ...(process.env.NODE_ENV === "development" && {
        tokens: {
          accessToken,
          refreshToken,
        },
      }),
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(error);
  }
}

/**
 * Logout user by clearing cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function logoutUser(req, res, next) {
  try {
    // Clear authentication cookies
    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    // Log logout
    const userEmail = req.user?.email || "Unknown";
    console.log(`Admin logout: ${userEmail} at ${new Date().toISOString()}`);

    return sendResponse(res, 200, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    return next(error);
  }
}

/**
 * Refresh access token using refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return sendResponse(res, 401, "Refresh token not provided");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return sendResponse(res, 401, "Invalid refresh token");
    }

    // Check if user still exists and is active
    const user = await User.findById(decoded.id).lean();
    if (!user || user.role !== "admin") {
      return sendResponse(res, 401, "User not found or unauthorized");
    }

    // Generate new access token with consistent payload structure
    const userPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateToken(userPayload);

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
    });

    return sendResponse(res, 200, "Token refreshed successfully", {
      ...(process.env.NODE_ENV === "development" && {
        accessToken: newAccessToken,
      }),
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return next(error);
  }
}

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getUserProfile(req, res, next) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, 401, "User not authenticated");
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    return sendResponse(res, 200, "Profile retrieved successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return next(error);
  }
}

/**
 * Change password for logged-in admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function changePasswordByEmail(req, res, next) {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return sendResponse(res, 400, "Email and newPassword are required");
    }

    // Validate password length
    if (newPassword.length < 8) {
      return sendResponse(
        res,
        400,
        "Password must be at least 8 characters long"
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    user.password = await hashing(newPassword);
    await user.save();

    console.log(
      `Password updated for ${user.email} at ${new Date().toISOString()}`
    );
    return sendResponse(res, 200, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    return next(error);
  }
}
