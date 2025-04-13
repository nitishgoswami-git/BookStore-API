import mongoose, { Schema }  from "mongoose";

const orderItemSchema = new Schema({
    product:{
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    quantity:{
        type:Number,
        required : true

    }
})

const orderSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items:[orderItemSchema],
    address:{
        type:String,
        required:true
    },
    amount:{
        type: Number,
        required: true
    },
    address:{   
        type: String,
        required: true
    },
    status :{
        type: String,
        enum: ['PENDING','CANCELLED','DELIVERED'],
        default: 'PENDING'
    }

},{timestamps:true})


export const Order = mongoose.model("Order", orderSchema)