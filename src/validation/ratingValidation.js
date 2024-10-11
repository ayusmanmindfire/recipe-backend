import Joi from "joi";

export const addRatingSchema=Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    feedback: Joi.string().required(),
})