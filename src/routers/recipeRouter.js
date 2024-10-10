import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import upload from "../middleware/fileUpload.js";
import RecipeController from "../controller/recipeController.js";

const recipeController=new RecipeController();
const router=Router();

router.post('/',verifyToken,upload.single('image'),recipeController.addNewRecipe); //route for adding new recipe

export default router;