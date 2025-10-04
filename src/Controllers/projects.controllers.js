import Project from "../Model/projects.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import cloudinary from "../config/cloudinary.js";
import { validateProject } from "../Validator/project.validator.js";

// Get all Projects public Route
export async function getAllProjects(req, res, next) {
  try {
    let page = Math.max(parseInt(req.query.page) || 1, 1);
    let limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };
    const projects = await Project.paginate({}, options);

    if (!projects || !projects.docs || projects.docs.length === 0) {
      return sendResponse(res, 404, "Projects are not available!");
    }
    return sendResponse(res, 200, "All projects fetched", projects);
  } catch (error) {
    return next(error);
  }
}

// Create New Project
export async function createProject(req, res, next) {
  try {
    if (!req.file) {
      return sendResponse(res, 400, '"previewImg" is required');
    }

    // ✅ Validate incoming data
    const { error, value } = validateProject.validate(req.body);
    if (error) {
      return sendResponse(res, 400, error.details[0].message);
    }

    const { name, description, githubLink, liveLink, skills } = value;

    if (!name || !description || !githubLink || !skills) {
      return sendResponse(res, 400, "Invalid details for project creation!");
    }

    // ✅ Parse skills
    let skillsArray = skills;
    if (typeof skills === "string") {
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        skillsArray = skills.split(",").map((s) => s.trim());
      }
    }

    // ✅ Upload image to Cloudinary
    let imageUrl;
    try {
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "portfolio_projects",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );

        // End the stream with buffer from multer
        uploadStream.end(req.file.buffer);
      });
    } catch (err) {
      console.error("Failed to upload image to Cloudinary:", err);
      return sendResponse(res, 500, "Failed to upload image");
    }

    // ✅ Create project in database
    const project = await Project.create({
      name,
      description,
      githubLink,
      liveLink,
      skills: skillsArray,
      previewImg: imageUrl,
    });

    return sendResponse(res, 201, "Project created!", { project });
  } catch (error) {
    console.error("Controller error:", error);
    return next(error);
  }
}

// Delete Project By Id
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 404, "No project id found!");
    }
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return sendResponse(res, 404, "Invalid project id!");
    }
    return sendResponse(res, 200, "Project deleted successfully!");
  } catch (error) {
    return next(error);
  }
}

// Delete All Projects
export async function deleteAllProjects(req, res, next) {
  try {
    const result = await Project.deleteMany();
    return sendResponse(
      res,
      200,
      `All projects deleted! Total: ${result.deletedCount}`
    );
  } catch (error) {
    return next(error);
  }
}
