import express from "express";

import { upload } from "../Services/videosUpload.multer.js";

import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../Controllers/experience.controllers.js";

import { authenticate } from "../Middleware/authVerifier.js";

const ExperienceRoutes = express.Router();

// Public - anyone can view
ExperienceRoutes.get("/", getAllExperiences);

// Admin only - protected
ExperienceRoutes.post(
  "/",
  authenticate,
  upload.single("logo"),
  createExperience
);
ExperienceRoutes.put(
  "/:id",
  authenticate,
  upload.single("logo"),
  updateExperience
);
ExperienceRoutes.delete("/:id", authenticate, deleteExperience);

export default ExperienceRoutes;
