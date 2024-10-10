import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import upload from "../middleware/fileUpload.js";
import RecipeController from "../controller/recipeController.js";

const recipeController=new RecipeController();
const router=Router();

router.post('/',verifyToken,upload.single('image'),recipeController.addNewRecipe); //route for adding new recipe.
router.get('/',verifyToken,recipeController.getAllRecipe); //route for fetching all recipe
router.get('/:id',verifyToken,recipeController.getDetailsOfARecipe) //route for fetching details of single recipe.
router.put('/:id',verifyToken,upload.single('image'),recipeController.updateRecipe) 
router.delete('/:id',verifyToken,recipeController.deleteRecipe) 

export default router;