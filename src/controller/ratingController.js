//Static imports
import RatingModel from "../database/models/ratingModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { addRatingSchema } from "../validation/ratingValidation.js";

class RatingController{

    // Method to allow a user to add a rating and feedback to a specific recipe.
    // Validates input using the schema, checks for duplicate ratings, and stores the rating in the database.
    addRating= async(req,res,next)=>{
        try {
            const recipeID=req.params.recipeID;
            const email=req.user.email;
            const {rating, feedback} =req.body;
            const isValid= addRatingSchema.validate({rating,feedback});
            if(isValid.error){
                return errorResponse(res,isValid.error.message,400)
            }
            const checkDuplicateRating= await RatingModel.findOne({recipeID:recipeID,createdBy:email});
            if(checkDuplicateRating){
                return errorResponse(res,"User already gave ratings for this recipe",400)
            }
            const ratingResponse = await RatingModel.create({
                recipeID: recipeID,
                rating: rating,
                feedback:feedback,
                createdBy: email
            })
            successResponse(res, ratingResponse, "Rating added to the recipe", 201)

        } catch (error) {
            next(error)
        }
    }

    // Method to fetch all ratings for a specific recipe.
    // Retrieves ratings from the database and returns them in the response.
    fetchRatingsByRecipeID = async(req,res,next)=>{
        try {
            const recipeID=req.params.recipeID;
            const ratingResponse = await RatingModel.find({recipeID:recipeID});
            successResponse(res, ratingResponse, "Ratings for specific recipe fetched", 200)
        } catch (error) {
            next(error)
        }
    }
}

export default RatingController;