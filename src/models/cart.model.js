import mongoose, { Schema }  from "mongoose";

const cartItemSchema = new Schema({
    product:{
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    quantity:{
        type:Number,
        required : true

    }
})

const cartSchema = new Schema({
    userId:{
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    items: [ cartItemSchema ],
    amount : {
        type: Number,
        required:true
    }
},{timestamps:true})

cartSchema.pre("save", async function(next){
    // assign totalAmount = 0
    // loop over the items in the cart
    // find the product 
    // add the price
    // set totalAmount
    // next

    let totalAmount = 0
    for (const item of this.items) {
        const product = await mongoose.model("Book").findById(item.product); 
        if (product) {
            totalAmount += product.price * item.quantity; 
        }
    }
    this.amount = totalAmount; 
    next();
})

export const Cart = mongoose.model("Cart",cartSchema)