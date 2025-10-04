import { sendResponse } from "../utils/sendResponse.js";
import Home from "../Model/home.model.js";
import { homeValidator } from "../Validator/home.validator.js";

// Default structure
const defaultHomeData = {
  hero: {
    greeting: "Available for opportunities",
    mainHeading: "I do code and make content",
    highlightedText: "about it!",
    description:
      "I am a passionate BCA student skilled in web development, coding, and creating digital content. I enjoy building projects, learning new technologies, and turning ideas into practical solutions.",
    highlightedRole: "BCA student",
    profileImg: "",
    profileAlt: "",
    techStack: [
      "React",
      "Node.js",
      "MongoDB",
      "Express.js",
      "JavaScript",
      "Tailwind CSS",
    ],
  },
  cta: {
    contactButton: "Get In Touch",
    resumeButton: "View Resume",
    resumeLink: "",
  },
  stats: {
    projects: "0",
    technologies: "0",
    years: "0",
  },
  education: {
    sectionTitle: "Education",
    sectionDescription:
      "My academic journey and qualifications that shaped my skills",
  },
};

// GET all home pages
export async function getHome(req, res, next) {
  try {
    const homePages = await Home.find();
    const mergedHomePages = homePages.map((page) => ({
      ...defaultHomeData,
      ...page.toObject(),
      stats: page.stats
        ? {
            projects: page.stats.projects || defaultHomeData.stats.projects,
            technologies:
              page.stats.technologies || defaultHomeData.stats.technologies,
            years: page.stats.years || defaultHomeData.stats.years,
          }
        : defaultHomeData.stats,
      education: {
        ...defaultHomeData.education,
        ...page.education,
      },
      hero: {
        ...defaultHomeData.hero,
        ...page.hero,
      },
      cta: {
        ...defaultHomeData.cta,
        ...page.cta,
      },
    }));
    return sendResponse(res, 200, "Fetched home page data", {
      homePages: mergedHomePages,
    });
  } catch (error) {
    console.error("GET home error:", error);
    next(error);
  }
}

// CREATE new home page
export async function createHome(req, res) {
  try {
    const { error, value } = homeValidator.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message);

    // Transform stats array from frontend to object
    const statsObj = Array.isArray(value.stats)
      ? {
          projects: value.stats[0]?.label || "0",
          technologies: value.stats[1]?.label || "0",
          years: value.stats[2]?.label || "0",
        }
      : value.stats || defaultHomeData.stats;

    const homeData = {
      ...defaultHomeData,
      ...value,
      stats: statsObj,
      education: {
        ...defaultHomeData.education,
        ...value.education,
      },
      hero: {
        ...defaultHomeData.hero,
        ...value.hero,
      },
      cta: {
        ...defaultHomeData.cta,
        ...value.cta,
      },
    };

    const newHome = new Home(homeData);
    await newHome.save();
    return sendResponse(res, 201, "Home page created", { home: newHome });
  } catch (error) {
    console.error("CREATE home error:", error);
    return sendResponse(res, 500, "Failed to create home page");
  }
}

// UPDATE existing home page
export async function updateHome(req, res) {
  try {
    const homeId = req.params.id;
    const { error, value } = homeValidator.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message);

    // Transform stats array from frontend to object
    const statsObj = Array.isArray(value.stats)
      ? {
          projects: value.stats[0]?.label || "0",
          technologies: value.stats[1]?.label || "0",
          years: value.stats[2]?.label || "0",
        }
      : value.stats || defaultHomeData.stats;

    const updateData = {
      ...defaultHomeData,
      ...value,
      stats: statsObj,
      education: {
        ...defaultHomeData.education,
        ...value.education,
      },
      hero: {
        ...defaultHomeData.hero,
        ...value.hero,
      },
      cta: {
        ...defaultHomeData.cta,
        ...value.cta,
      },
    };

    const updatedHome = await Home.findByIdAndUpdate(homeId, updateData, {
      new: true,
    });
    if (!updatedHome) return sendResponse(res, 404, "Home page not found");

    return sendResponse(res, 200, "Home page updated", { home: updatedHome });
  } catch (error) {
    console.error("UPDATE home error:", error);
    return sendResponse(res, 500, "Failed to update home page");
  }
}
