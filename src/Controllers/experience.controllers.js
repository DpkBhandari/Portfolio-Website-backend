import Experience from "../Model/experience.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Update Experience
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, role, startDate, endDate, description, isCurrent } =
      req.body;

    // Find existing experience
    const existingExperience = await Experience.findById(id);

    if (!existingExperience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    // Prepare update object
    const updateData = {
      companyName: companyName?.trim(),
      role: role?.trim(),
      startDate,
      isCurrent: isCurrent === "true" || isCurrent === true,
      description: description?.trim() || "",
    };

    // Handle endDate based on isCurrent
    if (updateData.isCurrent) {
      updateData.endDate = null;
    } else if (endDate) {
      updateData.endDate = endDate;
    }

    // Handle logo upload if new file provided
    if (req.file) {
      // Delete old logo from cloudinary if exists
      if (existingExperience.logo) {
        try {
          const publicId = existingExperience.logo
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(`experience_logos/${publicId}`);
        } catch (err) {
          console.error("Error deleting old logo:", err);
        }
      }

      // Upload new logo
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "experience_logos",
        transformation: [
          { width: 200, height: 200, crop: "fill" },
          { quality: "auto" },
        ],
      });

      updateData.logo = result.secure_url;

      // Delete temporary file
      fs.unlinkSync(req.file.path);
    }

    // Update experience in database
    const updatedExperience = await Experience.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: "Failed to update experience",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: updatedExperience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update experience",
    });
  }
};

// Create Experience
export const createExperience = async (req, res) => {
  try {
    const { companyName, role, startDate, endDate, description, isCurrent } =
      req.body;

    // Validate required fields
    if (!companyName || !role || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Company name, role, and start date are required",
      });
    }

    // Prepare experience data
    const experienceData = {
      companyName: companyName.trim(),
      role: role.trim(),
      startDate,
      isCurrent: isCurrent === "true" || isCurrent === true,
      description: description?.trim() || "",
    };

    // Handle endDate
    if (!experienceData.isCurrent && endDate) {
      experienceData.endDate = endDate;
    }

    // Handle logo upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "experience_logos",
        transformation: [
          { width: 200, height: 200, crop: "fill" },
          { quality: "auto" },
        ],
      });

      experienceData.logo = result.secure_url;

      // Delete temporary file
      fs.unlinkSync(req.file.path);
    }

    // Create new experience
    const newExperience = await Experience.create(experienceData);

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: newExperience,
    });
  } catch (error) {
    console.error("Create experience error:", error);

    // Clean up uploaded file if exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create experience",
    });
  }
};

// Get All Experiences
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error("Get experiences error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch experiences",
    });
  }
};

// Delete Experience
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    // Delete logo from cloudinary if exists
    if (experience.logo) {
      try {
        const publicId = experience.logo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`experience_logos/${publicId}`);
      } catch (err) {
        console.error("Error deleting logo:", err);
      }
    }

    await Experience.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};
