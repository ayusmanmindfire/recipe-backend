//Third party imports
import mongoose from "mongoose";

// Retrieve the MongoDB connection URL from environment variables.
const mongoUrl=process.env.MONGO_URL;

// Function to establish a connection to the MongoDB database.
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