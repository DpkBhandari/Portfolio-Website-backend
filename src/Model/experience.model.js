import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String, trim: true },
    isCurrent: { type: Boolean, default: false },
    logo: { type: String, trim: true },
  },
  { timestamps: true }
);

experienceSchema.index({ companyName: 1, role: 1 });

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
