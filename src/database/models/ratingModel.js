//Third party import
import mongoose from "mongoose";

// Schema for storing recipe ratings in the database.
// Each rating is linked to a specific recipe, contains a numeric rating, feedback, 
// and information about the user who created the rating.
const ratingSchema= new mongoose.Schema({
    recipeID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        require: true,
    },
    rating:{
        type: Number,
        require: true
    },
    feedback:{
        type: String,
        require: true
    },
    createdBy:{
        type: String,
        require: true,
    }
},
{
    timestamps: true
})

const RatingModel=new mongoose.model("Rating", ratingSchema);

export default RatingModel;