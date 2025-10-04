// src/middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../Model/user.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { generateToken } from "../utils/jwtToken.js";

const secret = config.jwt_secret;

/**
 * Authenticate user via access token or refresh token
 */
export async function authenticate(req, res, next) {
  try {
    // 1️⃣ Get access token from cookies or headers
    let token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    let decoded = null;

    // 2️⃣ Verify access token
    if (token) {
      try {
        decoded = jwt.verify(token, secret);
        req.user = decoded;
        return next();
      } catch (err) {
        if (err.name !== "TokenExpiredError") {
          console.error(err);
          return sendResponse(res, 401, "Invalid token");
        }
        // Token expired → fallback to refresh token
      }
    }

    // 3️⃣ Fallback: verify refresh token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return sendResponse(res, 401, "No token provided");

    const decodedRefresh = jwt.verify(refreshToken, secret);
    const user = await User.findById(decodedRefresh.id);
    if (!user) return sendResponse(res, 401, "Admin not found");

    // Optional: enforce admin-only access
    if (user.role !== "admin") return sendResponse(res, 403, "Forbidden");

    // 4️⃣ Generate new access token
    const newAccessToken = generateToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // 5️⃣ Attach user info to request
    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    return sendResponse(res, 401, "Unauthorized");
  }
}

/**
 * Authorize user roles
 * Example: authorizeRoles("admin")
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return sendResponse(res, 401, "Unauthorized");
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, "Forbidden: Access denied");
    }
    next();
  };
}
