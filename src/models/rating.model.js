import mongoose, { Schema }  from "mongoose";


const ratingSchema = new Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        ref : "User"
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    rating:{
        type: Number,
        enum :[1,2,3,4,5]
    }
},{timestamps:true})

export const Rating = mongoose.model("Rating",ratingSchema)