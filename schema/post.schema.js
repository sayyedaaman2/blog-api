import Joi from "joi";

export const postCreateValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      "string.base": "Title must be a text string",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 200 characters",
      "any.required": "Title field is required"
    }),

  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "slug-format" })
    .required()
    .messages({
      "string.pattern.name": "Slug must be lowercase, alphanumeric and may include hyphens (e.g. 'my-first-post')",
      "string.empty": "Slug cannot be empty",
      "any.required": "Slug field is required"
    }),

  content: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.base": "Content must be a text string",
      "string.min": "Content must be at least 10 characters long",
      "any.required": "Content field is required"
    }),

  tags: Joi.array()
    .items(Joi.string().trim())
    .default([])
    .messages({
      "array.base": "Tags must be an array of strings"
    }),

  published: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "Published must be a boolean value (true/false)"
    })
});

export const postUpdateValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .messages({
      "string.base": "Title must be a text string",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 200 characters"
    }),

  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "slug-format" })
    .messages({
      "string.pattern.name":
        "Slug must be lowercase, alphanumeric and may include hyphens (e.g. 'my-first-post')",
      "string.empty": "Slug cannot be empty"
    }),

  content: Joi.string()
    .min(10)
    .messages({
      "string.base": "Content must be a text string",
      "string.min": "Content must be at least 10 characters long"
    }),

  // author is intentionally NOT updatable here.
  // If you want to allow changing author, copy the rule from create schema.

  tags: Joi.array()
    .items(Joi.string().trim())
    .messages({
      "array.base": "Tags must be an array of strings"
    }),

  published: Joi.boolean()
    .messages({
      "boolean.base": "Published must be a boolean value (true/false)"
    })
})
  // require at least one field in the body for update
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the post"
  });
