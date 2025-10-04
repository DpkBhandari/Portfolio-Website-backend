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

app.use(limiter);

// ✅ Security
app.use(helmet({ contentSecurityPolicy: false }));

// ✅ Logging (dev only)
if (process.env.PHASE === "development") app.use(morgan("dev"));

// ✅ CORS Configuration

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://portfolio-website-gold-xi.vercel.app/",
    ],
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

// ✅ Body Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes Base Testing
app.get("/", (req, res) => sendResponse(res, 200, "Server is running!"));

// Login and register
app.use("/api/admin", AdminRoutes);

//Project Routes
app.use("/api/", ProjectRoutes);

//Home Routes
app.use("/api/home", HomeRoutes);

// Experience Routes
app.use("/api/experience", ExperienceRoutes);

// ✅ Catch-all 404
app.get((req, res) => sendResponse(res, 404, "Page doesn't exist"));

// ✅ Global Error Handler
app.use(GlobalErrorHandler);

export default app;
