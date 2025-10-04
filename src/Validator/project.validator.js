import Joi from "joi";

export const validateProject = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  githubLink: Joi.string().uri().required(),
  liveLink: Joi.string().uri().optional().allow(""),
  skills: Joi.alternatives()
    .try(Joi.array().items(Joi.string().min(1)), Joi.string())
    .required(),
});
