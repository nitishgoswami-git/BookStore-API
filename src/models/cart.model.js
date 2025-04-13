import mongoose, { Schema } from "mongoose";

//  Cart Item Subschema
const cartItemSchema = new Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0 
  }
});

//Main Cart Schema
const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    amount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

//  Pre-save hook to calculate individual totals + cart total
cartSchema.pre("save", async function (next) {
  let totalAmount = 0;

  for (const item of this.items) {
    const product = await mongoose.model("Book").findById(item.product);
    if (product) {
      item.totalPrice = product.price * item.quantity;
      totalAmount += item.totalPrice;
    }
  }

  this.amount = totalAmount;
  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
