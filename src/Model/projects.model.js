import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;

const projectSchema = new mongoose.Schema(
  {
    previewImg: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    githubLink: {
      type: String,
      required: true,
      match: [urlRegex, "Please enter a valid GitHub URL"],
    },
    liveLink: {
      type: String,
      match: [urlRegex, "Please enter a valid Live URL"],
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

projectSchema.plugin(mongoosePaginate);

const Project = mongoose.model("Project", projectSchema);

export default Project;
