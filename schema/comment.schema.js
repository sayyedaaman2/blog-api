

import Joi from 'joi';

export const commentCreateValidationSchema = Joi.object({
    content : Joi.string().min(5).max(100).required(),
})
