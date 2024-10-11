import {Router} from "express";
import verifyToken from "../middleware/authMiddleware.js";
import RatingController from "../controller/ratingController.js";

const router=Router();
const ratingController=new RatingController();

router.post('/:recipeID',verifyToken,ratingController.addRating); //route for adding ratings for a specific recipe
router.get('/:recipeID',verifyToken,ratingController.fetchRatingsByRecipeID) //route for fetching ratings of specific recipe

export default router;