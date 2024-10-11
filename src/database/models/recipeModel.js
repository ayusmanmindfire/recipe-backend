import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: String, 
    required: true
  },
  image: {
    data: Buffer,   
    contentType: String  // Content type of the image (e.g., 'image/png')
  },
  createdBy: {
    type: String, // Reference to the user's email who created the recipe
    required: true,
    ref: 'UserModel' 
  }
},
{
    timestamps: true
});
recipeSchema.index({ title: 'text', ingredients: 'text'})
const RecipeModel = mongoose.model('Recipe', recipeSchema);

export default RecipeModel;
