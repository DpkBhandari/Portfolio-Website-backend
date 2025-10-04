import Joi from "joi";

export const homeValidator = Joi.object({
  _id: Joi.string().optional().strip(),
  __v: Joi.number().optional().strip(),
  hero: Joi.object({
    greeting: Joi.string().required(),
    mainHeading: Joi.string().required(),
    highlightedText: Joi.string().required(),
    description: Joi.string().required(),
    highlightedRole: Joi.string().required(),
    profileImg: Joi.string().allow(""),
    profileAlt: Joi.string().allow(""),
    techStack: Joi.array().items(Joi.string()).required(),
  }).required(),
  cta: Joi.object({
    contactButton: Joi.string().allow(""),
    resumeButton: Joi.string().allow(""),
    resumeLink: Joi.string().allow(""),
  }).required(),
  stats: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        icon: Joi.string().allow(""),
        label: Joi.string().allow(""),
      })
    ),
    Joi.object({
      projects: Joi.string().allow(""),
      technologies: Joi.string().allow(""),
      years: Joi.string().allow(""),
    })
  ),
  education: Joi.object({
    sectionTitle: Joi.string().allow(""),
    sectionDescription: Joi.string().allow(""),
  }).allow(null),
});
