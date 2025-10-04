import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limiter } from "./utils/rate.limiting.js";
import GlobalErrorHandler from "./Middleware/GlobalErrorHandaler.js";
import { sendResponse } from "./utils/sendResponse.js";

import AdminRoutes from "./Routes/admin.routes.js";
import ProjectRoutes from "./Routes/project.routes.js";
import HomeRoutes from "./Routes/home.routes.js";
import ExperienceRoutes from "./Routes/experience.routes.js";

const app = express();

// ✅ Rate Limiting
app.use(limiter);

// ✅ Security
app.use(helmet({ contentSecurityPolicy: false }));

// ✅ Logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ✅ CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // allow Vercel + localhost
    credentials: true,
  })
);

// ✅ Body Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes Base Testing
app.get("/", (req, res) => sendResponse(res, 200, "Server is running!"));

// ✅ Routes
app.use("/api/admin", AdminRoutes);
app.use("/api/projects", ProjectRoutes);
app.use("/api/home", HomeRoutes);
app.use("/api/experience", ExperienceRoutes);

// ✅ Catch-all 404
app.all("*", (req, res) => sendResponse(res, 404, "Page doesn't exist"));

// ✅ Global Error Handler
app.use(GlobalErrorHandler);

export default app;
