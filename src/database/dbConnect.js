import mongoose from "mongoose";

const mongoUrl=process.env.MONGO_URL;

async function dbConnect(){
    try {
        await mongoose.connect(mongoUrl).then(()=>{
            console.log("Database is connected")
        })
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect;