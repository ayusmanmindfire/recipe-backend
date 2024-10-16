import UserModel from "../database/models/UserModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { registerUserSchema } from "../validation/userValidation.js";
import jwt from "jsonwebtoken"

const secretKey=process.env.JWT_SECRET;
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

    //get user details from token
    fetchUserDetailsFromToken=async(req,res,next)=>{
        try {
            const userResponse=req.user;
            successResponse(res,userResponse,"User details from token fetched",200)
        } catch (error) {
            next(error)
        }
    }

    //method for user authentication
    loginUser=async(req,res,next)=>{
        try {
            const { email, password } = req.body;
            if(!password||!email){
                return errorResponse(res,"Provide email and password",400);
            }
            const existingUser = await UserModel.findOne({email,password});
            if (existingUser) {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        email: existingUser.email,
                        username: existingUser.username
                    },
                    secretKey,
                    {expiresIn: '24h'}
    
                )
                return successResponse(res,token,"Token generated",200)
            }
            else{
                return errorResponse(res,"User not found",404)
            }
        } catch (error) {
            next(error)
        }
    }
}

export default UserController;