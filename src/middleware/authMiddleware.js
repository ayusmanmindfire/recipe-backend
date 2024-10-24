//Third party imports
import jwt from "jsonwebtoken"

//Static imports
import { errorResponse } from "../utils/response.js";

//Fetching secret key from the environment variables
const secretKey = process.env.JWT_SECRET;

//Middleware function to verify the JWT token fetched from the authorization header
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token)
        return errorResponse(res, "Access denied", 401)
    const tokenArray=token.split(" ")
    const realToken=tokenArray[1]

    try {
        const decoded = jwt.verify(realToken, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        next(error)
    }
};

export default verifyToken;