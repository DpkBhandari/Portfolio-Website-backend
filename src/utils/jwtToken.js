import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secret = config.jwt_secret;

export function generateToken(user) {
  if (!user.id || !user.email || !user.role) {
    throw new Error("Invalid user object for token generation");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "1h" }
  );
}

export function generateRefreshToken(user) {
  if (!user.id || !user.email || !user.role) {
    throw new Error("Invalid user object for token generation");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error("Refresh token verify failed:", error.message);
    return null;
  }
}
