import { Router } from "express";
import UserController from "../controller/userController.js";
const router = Router();

const userController=new UserController();

router.post('/register',userController.registerUser); //route for registering new user.

export default router;