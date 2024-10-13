import Joi from 'joi';

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

  // image: Joi.object({
  //   data: Joi.binary().required(),
  //   contentType: Joi.string()
  //     .valid('image/jpeg', 'image/png', 'image/jpg')
  //     .required()
  // }).required(),
});
