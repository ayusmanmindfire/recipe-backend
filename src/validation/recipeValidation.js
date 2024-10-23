//Third party import
import Joi from 'joi';

//Validation schema for new recipe
export const newRecipeSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  ingredients: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required(),

  steps: Joi.string().required(),
});
