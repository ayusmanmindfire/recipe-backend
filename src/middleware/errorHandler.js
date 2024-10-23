//Static imports
import { errorResponse } from "../utils/response.js";

// Middleware function to handle errors setup globally
export function errorHandler(error,req,res,next){
    const errorCode=error.statusCode||500;
    const message=error.message||"Internal server error";

    errorResponse(res,message,errorCode)
    next()
}