//Static imports
import RecipeModel from "../database/models/recipeModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { newRecipeSchema } from "../validation/recipeValidation.js";
import { validMimeTypes } from "../utils/constants.js";

class RecipeController {

    // Method for adding a new recipe.
    // Checks for image file, validates the input and stores the recipe in the database.
    addNewRecipe = async (req, res, next) => {
        try {
            const email = req.user.email;
            const { title, ingredients, steps } = req.body;
            if (!req.file||!validMimeTypes.includes(req.file.mimetype)) {
                return errorResponse(res, "Image file is missing", 400);
            }
            const imagePath =req.file.filename; 
            const isValid = newRecipeSchema.validate({ title, ingredients, steps })
            if (isValid.error) {
                return errorResponse(res, isValid.error.message, 400)
            }
            const recipeResponse = await RecipeModel.create({
                title: title,
                ingredients: ingredients,
                steps: steps,
                image: imagePath,
                createdBy: email
            });
            successResponse(res, recipeResponse, "New recipe added", 201)
        } catch (error) {
            next(error)
        }
    }

    //method for fetching all recipe from database with pagination based on page and limit
    getAllRecipe = async (req, res, next) => {
        try {
            // Set default values for page and limit if not provided
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;
    
            // Fetch recipes with pagination
            const response = await RecipeModel.find().skip(skip).limit(limit);
    
            const totalRecipes = await RecipeModel.countDocuments();
    
            // Construct pagination metadata
            const pagination = {
                totalRecipes,
                currentPage: page,  
                totalPages: Math.ceil(totalRecipes / limit),
                limit
            };
    
            successResponse(res, { recipes: response, pagination }, "All recipes fetched", 200);
        } catch (error) {
            next(error);
        }
    };
    

    //method for fetching details of a single recipe using ID (available as URL params) from database
    getDetailsOfARecipe = async (req, res, next) => {
        try {
            const _id = req.params.id
            const response = await RecipeModel.findOne({ _id });
            if (!response) {
                return errorResponse(res, "Recipe not found", 404)
            }
            successResponse(res, response, "Details of a recipe fetched", 200)
        } catch (error) {
            next(error)
        }
    }

    // Method for updating an existing recipe.
    // Validates the user who created that recipe, the inputs, and updates the recipe in the database.
    updateRecipe = async (req, res, next) => {
        try {
            const _id = req.params.id;
            const {email}=req.user
            const { title, ingredients, steps } = req.body;
            const response = await RecipeModel.findOne({ _id });
            if(!response){
                return errorResponse(res, "Recipe not found", 404);
            }
            if(response.createdBy!=email){
                return errorResponse(res, "Not authorized user to update the recipe",409);
            }
            if(!req.file||!validMimeTypes.includes(req.file.mimetype)){
                return errorResponse(res,"Provide a valid image",400)
            }
            const image=req.file.filename // stored image name only in the database
            const isValid = newRecipeSchema.validate({ title, ingredients, steps })
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

    // Method for deleting a recipe.
    // Validates the user who created that particular recipe and deletes the recipe from the database.
    deleteRecipe = async (req, res, next) => {
        try {
            const _id = req.params.id;
            const {email}=req.user
            const response = await RecipeModel.findOne({ _id });
            if(response.createdBy!=email){
                return errorResponse(res, "Not authorized user to delete the recipe",409);
            }
            const recipeResponse = await RecipeModel.findByIdAndDelete(_id);
            if (!recipeResponse) {
                return errorResponse(res, "Recipe not found", 404);
            }
            return successResponse(res, null, "Recipe deleted successfully", 200);
        } catch (error) {
            next(error);
        }
    }

    // Method for searching recipes by a query.
    // Performs a text search on the indexed fields of the recipes.
    searchRecipes=async(req,res,next)=>{
        try {
            const searchQuery=req.query.q; //get search query
            if (!searchQuery) {
                const response = await RecipeModel.find();
                return successResponse(res, response, "All recipes fetched", 200)
            }
            const recipes = await RecipeModel.find(
                { $text: { $search: searchQuery } }, // Text search on indexed fields
                { score: { $meta: "textScore" } } 
            )
            .sort({ score: { $meta: "textScore" } }) // Sort by text score
            
            successResponse(res, recipes, "Recipes fetched successfully", 200);
        } catch (error) {
            next(error)
        }
    }
}

export default RecipeController