import RecipeModel from "../database/models/recipeModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { newRecipeSchema } from "../validation/recipeValidation.js";
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class RecipeController {
    //method for adding new recipe
    addNewRecipe = async (req, res, next) => {
        try {
            const email = req.user.email;
            const { title, ingredients, steps } = req.body;
            if (!req.file) {
                return errorResponse(res, "Image file is missing", 400);
            }

            // Create image object
            const image = {
                data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)), // Path to saved image
                contentType: req.file.mimetype // Use the actual mime type (png, jpeg, etc.)
            };
            const isValid = newRecipeSchema.validate({ title, ingredients, steps, image })
            if (isValid.error) {
                return errorResponse(res, isValid.error.message, 400)
            }

            const recipeResponse = await RecipeModel.create({
                title: title,
                ingredients: ingredients,
                steps: steps,
                image: image,
                createdBy: email
            });
            successResponse(res, recipeResponse, "New recipe added", 201)
        } catch (error) {
            next(error)
        }
    }
}

export default RecipeController