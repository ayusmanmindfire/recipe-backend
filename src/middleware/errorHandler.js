//Static imports
import mongoose from "mongoose";
import { errorResponse } from "../utils/response.js";

// Middleware function to handle errors setup globally
export function errorHandler(error,req,res,next){
    const errorCode=error.statusCode||500;
    const message=error.message||"Internal server error";

     // Handle MongoDB-specific errors
    if (error instanceof mongoose.Error.ValidationError) {
        return errorResponse(res, "Validation error", 400);
    }
    if (error instanceof mongoose.Error.CastError) {
        return errorResponse(res, "Invalid ID format", 400);
    }
    if (error.code === 11000) { // Duplicate key error
        return errorResponse(res, "Duplicate key error", 409);
    }

    errorResponse(res,message,errorCode)
    next()
}