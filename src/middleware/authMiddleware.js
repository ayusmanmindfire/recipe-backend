import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/response.js";


const secretKey = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token)
        return errorResponse(res, "Access denied", 401)
    const tokenArray=token.split(" ")
    const realToken=tokenArray[1]

    try {
        const decoded = jwt.verify(realToken, secretKey);
        // console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        next(error)
    }
};

export default verifyToken;