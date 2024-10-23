//Third party imports
import jwt from "jsonwebtoken"

//Static imports
import UserModel from "../database/models/UserModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { registerUserSchema } from "../validation/userValidation.js";

//Fetching JWT secret key and expiry time from environment
const secretKey=process.env.JWT_SECRET;
const jwtExpiry=process.env.JWT_EXPIRY;

class UserController{

    // Method for registering a new user.
    // Validates input data and creates a new user in the database.
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

    //method for fetching all users from the database
    fetchAllUser=async(req,res,next)=>{
        try {
            const userResponse = await UserModel.find();
            successResponse(res,userResponse,"All users fetched",200)
        } catch (error) {
            next(error)
        }
    }

    // Method for fetching user details from token.
    // Retrieves user data stored in the JWT token.
    fetchUserDetailsFromToken=async(req,res,next)=>{
        try {
            const userResponse=req.user;
            successResponse(res,userResponse,"User details from token fetched",200)
        } catch (error) {
            next(error)
        }
    }

    // Method for authenticating user login.
    // Verifies credentials and generates a JWT token on successful login.
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
                    {expiresIn: jwtExpiry}
    
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