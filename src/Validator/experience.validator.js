import Joi from "joi";

// Experience Validator

export const experienceValidator = Joi.object({
  companyName: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.alternatives()
    .try(Joi.date().greater(Joi.ref("startDate")), Joi.valid(null, ""))
    .optional(),
  description: Joi.string().trim().optional(),
  isCurrent: Joi.boolean().default(false),
  logo: Joi.string().uri().optional(),
});
