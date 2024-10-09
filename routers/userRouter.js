import { Router } from "express";
import UserController from "../controller/userController.js";
const router = Router();

const userController=new UserController();

router.get('/',userController.getUser);

export default router;