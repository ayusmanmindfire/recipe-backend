import UserModel from "../database/models/UserModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { registerUserSchema } from "../validation/userValidation.js";


class UserController{
    //method for register a new user 
    registerUser=async(req,res,next)=>{
        try {
            const {username,email,password}=req.body;
            const isValid = registerUserSchema.validate({username,email,password})
            if (isValid.error) {
                return errorResponse(res, isValid.error.message, 400)
            }
            const userResponse = await UserModel.create({username,email,password});
            successResponse(res,userResponse,"New user created",201)
        } catch (error) {
            next(error)
        }
    }

    //method for fetching all users in the database
    fetchAllUser=async(req,res,next)=>{
        try {
            const userResponse = await UserModel.find();
            successResponse(res,userResponse,"All users fetched",200)
        } catch (error) {
            next(error)
        }
    }
}

export default UserController;