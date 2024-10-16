import { Router } from "express";
import UserController from "../controller/userController.js";
import verifyToken from "../middleware/authMiddleware.js";
const router = Router();

const userController=new UserController();

router.post('/register',userController.registerUser); //route for registering new user.
router.get('/',verifyToken,userController.fetchAllUser); //route for fetching all users
router.get('/verify',verifyToken,userController.fetchUserDetailsFromToken) //route for decoding user details using token
router.post('/login',userController.loginUser); //route for login a user.

export default router;