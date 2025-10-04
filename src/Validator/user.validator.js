import joi from "joi";

export const registerUserValidator = joi.object({
  name: joi
    .string()
    .pattern(/^[a-zA-Z\s]{2,50}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Name must only contain letters and spaces (2-50 chars)",
      "any.required": "Name is required",
    }),
  email: joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: joi.string().min(6).max(64).required().messages({
    "string.pattern.base":
      "Password must contain only letters and numbers (6-64 chars)",
    "any.required": "Password is required",
  }),
});

export const loginUserValidator = joi.object({
  email: joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: joi.string().min(6).max(64).required().messages({
    "string.pattern.base":
      "Password must contain only letters and numbers (6-64 chars)",
    "any.required": "Password is required",
  }),
});
