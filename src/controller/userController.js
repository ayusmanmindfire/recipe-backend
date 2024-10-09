import UserRepository from "../repository/userRepository.js";
import { successResponse } from "../utils/response.js";

const userRepository=new UserRepository();

class UserController{
    getUser=async(req,res,next)=>{
        const data=userRepository.findUser();
        successResponse(res,data,"hello from controller",200)
    }
}

export default UserController;