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
            // const imagePath = path.join('uploads', req.file.filename); //for storing the path in db only
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

    //method for fetching all recipe
    getAllRecipe = async (req, res, next) => {
        try {
            const response = await RecipeModel.find();
            successResponse(res, response, "All recipes fetched", 200)
        } catch (error) {
            next(error)
        }
    }

    //method for fetching details of a single recipe
    getDetailsOfARecipe = async (req, res, next) => {
        try {
            const _id = req.params.id
            // console.log(_id)
            const response = await RecipeModel.findOne({ _id });
            if (!response) {
                return errorResponse(res, "Recipe not found", 404)
            }
            successResponse(res, response, "Details of a recipe fetched", 200)
        } catch (error) {
            next(error)
        }
    }

    // Method for updating a recipe
    updateRecipe = async (req, res, next) => {
        try {
            const _id = req.params.id;
            const { title, ingredients, steps } = req.body;
            const response = await RecipeModel.findOne({ _id });
            if(!response){
                return errorResponse(res, "Recipe not found", 404);
            }
            let image=response.image
            // Check if an image file is uploaded
            if (req.file) {
                image = {
                    data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)), // Path to saved image
                    contentType: req.file.mimetype // Use the actual mime type (png, jpeg, etc.)
                };
            }
            const isValid = newRecipeSchema.validate({ title, ingredients, steps, image })
            if (isValid.error) {
                return errorResponse(res, isValid.error.message, 400)
            }
            
            const recipeResponse = await RecipeModel.findByIdAndUpdate(_id, {title, ingredients, steps,image}, { new: true });
            if (!recipeResponse) {
                return errorResponse(res, "Recipe not found", 404);
            }
            successResponse(res, recipeResponse, "Recipe updated successfully", 200);
        } catch (error) {
            next(error);
        }
    }

    // Method for deleting a recipe
    deleteRecipe = async (req, res, next) => {
        try {
            const _id = req.params.id;
            const recipeResponse = await RecipeModel.findByIdAndDelete(_id);
            if (!recipeResponse) {
                return errorResponse(res, "Recipe not found", 404);
            }
            return successResponse(res, null, "Recipe deleted successfully", 200);
        } catch (error) {
            next(error);
        }
    }

    //Method for search queries
    searchRecipes=async(req,res,next)=>{
        try {
            const searchQuery=req.query.q; //get search query
            if (!searchQuery) {
                return errorResponse(res, "Search query is required", 400);
            }
            const recipes = await RecipeModel.find(
                { $text: { $search: searchQuery } }, // Text search on indexed fields
                { score: { $meta: "textScore" } } 
            )
            .sort({ score: { $meta: "textScore" } }) // Sort by text score
            if (!recipes.length) {
                return errorResponse(res, "No recipes found for the given query", 404);
            }

            successResponse(res, recipes, "Recipes fetched successfully", 200);
        } catch (error) {
            next(error)
        }
    }
}

export default RecipeController