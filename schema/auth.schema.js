import Joi from "joi";
import { userRoles } from "../utils/contants.js";

export const signUpValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name cannot be longer than 50 characters",
      "any.required": "Name is required"
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "digit")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 100 characters",
      "string.pattern.name": "Password must contain at least one uppercase letter, one lowercase letter and one digit",
      "any.required": "Password is required"
    }),

  role: Joi.string()
    .valid(userRoles.ADMIN, userRoles.AUTHOR, userRoles.USER)
    .default(userRoles.USER)
    .messages({
      "any.only": "Role must be one of ADMIN, AUTHOR or USER"
    })
});

export const logInValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required"
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "digit")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 100 characters",
      "string.pattern.name": "Password must contain uppercase, lowercase and at least one digit",
      "any.required": "Password is required"
    })
});
