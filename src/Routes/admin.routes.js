import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  changePasswordByEmail,
} from "../Controllers/user.controllers.js";
import { loginLimiter } from "../utils/rate.limiting.js";
import { authenticate } from "../Middleware/authVerifier.js";

const AdminRoutes = express.Router();

// Register new admin/user
AdminRoutes.post("/register", registerUser);

// Login with rate limiting
AdminRoutes.post("/login", loginLimiter, loginUser);

// Logout (protected)
AdminRoutes.post("/logout", authenticate, logoutUser);

// Forgot Password

AdminRoutes.post("/change-password", changePasswordByEmail);

// Refresh JWT token
AdminRoutes.post("/refresh-token", refreshToken);

// Get profile (protected route)
AdminRoutes.get("/profile", authenticate, getUserProfile);

export default AdminRoutes;
