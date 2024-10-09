import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        require: true
    }
},
{
    timestamps: true
})

const UserModel=new mongoose.model("User", userSchema);

export default UserModel;