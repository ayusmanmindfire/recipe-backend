import mongoose from "mongoose";

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