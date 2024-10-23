//Third party imports
import mongoose from 'mongoose';

// Schema for storing recipe details in the database.
// Each recipe has a title, list of ingredients, steps, image-path, 
// and is linked to the user who created it.
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
    type: String,
    required: true
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

// Creates a text index on 'title' and 'ingredients' for text-based search.
recipeSchema.index({ title: 'text', ingredients: 'text'})

const RecipeModel = mongoose.model('Recipe', recipeSchema);

export default RecipeModel;
