import express from "express";
import {
  getAllProjects,
  createProject,
  deleteProject,
  deleteAllProjects,
} from "../Controllers/projects.controllers.js";
const ProjectRoutes = express.Router();

import { authenticate } from "../Middleware/authVerifier.js";

import { upload } from "../Services/videosUpload.multer.js";

// Get all projects
ProjectRoutes.get("/projects", getAllProjects);

// Add a new project
ProjectRoutes.post(
  "/create-projects",
  authenticate,
  upload.single("previewImg"),
  createProject
);
// Update a project by id
ProjectRoutes.put("/projects/:id", authenticate, (req, res) => {
  res.send(`Update project ${req.params.id}`);
});

// Delete ALl Projects

ProjectRoutes.delete("/projects/delete-all", authenticate, deleteAllProjects);
// Delete a project by id
ProjectRoutes.delete("/projects/:id", authenticate, deleteProject);

export default ProjectRoutes;
