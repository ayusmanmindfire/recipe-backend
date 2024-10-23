//Third party import
import Joi from "joi";

//Validation schema for new user registration
export const registerUserSchema=Joi.object({
    username: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^(?=.*[!@#$%^&*(),.?\":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>]{8,30}$")),
})