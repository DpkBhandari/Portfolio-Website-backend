import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  hero: {
    greeting: { type: String, required: true },
    mainHeading: { type: String, required: true },
    highlightedText: { type: String, required: true },
    description: { type: String, required: true },
    highlightedRole: { type: String, required: true },
    profileImg: { type: String, default: "" },
    profileAlt: { type: String, default: "" },
    techStack: [{ type: String, required: true }],
  },
  cta: {
    contactButton: { type: String, default: "Get In Touch" },
    resumeButton: { type: String, default: "View Resume" },
    resumeLink: { type: String, default: "" },
  },
  stats: {
    projects: { type: String, default: "0" },
    technologies: { type: String, default: "0" },
    years: { type: String, default: "0" },
  },
  education: {
    sectionTitle: { type: String, default: "Education" },
    sectionDescription: {
      type: String,
      default: "My academic journey and qualifications that shaped my skills",
    },
  },
});

const Home = mongoose.model("Home", homeSchema);
export default Home;
