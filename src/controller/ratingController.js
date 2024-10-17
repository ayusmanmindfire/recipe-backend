import RatingModel from "../database/models/ratingModel.js";
import RecipeModel from "../database/models/recipeModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { addRatingSchema } from "../validation/ratingValidation.js";


class RatingController{
    //Method for adding rating to a particular recipe
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
            // console.log(checkDuplicateRating)
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

    //Method for fetching ratings for specific recipe
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