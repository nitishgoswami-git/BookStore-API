import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
      type: {
          public_id: String,
          url: String //cloudinary url
      },
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive"]
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"]
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);
