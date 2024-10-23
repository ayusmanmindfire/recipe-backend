//Third party imports
import Joi from "joi";

//Validation schema for new rating
export const addRatingSchema=Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    feedback: Joi.string().required(),
})