import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxLength: [100, "Book title can not be more than 100 characters"],
      },
      author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
      },
      year: {
        type: Number,
        required: [true, "Publication year is required"],
        min: [1000, "Year must be atleast 1000"],
        max: [new Date().getFullYear(), "Year cannot be in the future"],
      },
},{timestamps:true})

export const Book = mongoose.model("Book",bookSchema)