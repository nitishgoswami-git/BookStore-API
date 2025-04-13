import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Book } from "../models/book.model.js";
import { isValidObjectId } from "mongoose";

// Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    // 1. Query Book db for all books
    // 2. If found, send response 
    // 3. If not, send message saying no books were found
    try {
        const BookList = await Book.find({});
        if (BookList.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, {}, "No books found")
            );
        }
        return res.status(200).json(
            new ApiResponse(200, { data: BookList }, "Books fetched successfully")
        );
    } catch (err) {
        throw new ApiError(400, "Something went wrong while fetching books");
    }
});

// Get single book by ID
const getSingleBookById = asyncHandler(async (req, res) => {
    // 1. Get book ID from req.params
    // 2. Verify the ID is valid
    // 3. Find book based on ID
    // 4. If found, send res with book details
    // 5. If not found, send error message
    const bookId = req.params.id;
    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid book ID");
    }

    const bookDetails = await Book.findById(bookId);
    if (!bookDetails) {
        throw new ApiError(400, "Book not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { data: bookDetails }, "Book found successfully")
    );
});

// Add new book
const addNewBook = asyncHandler(async (req, res) => {
    // 1. Get book details from request body
    // 2. Validate fields (title, author, description, price, stock, genre)
    // 3. Check if book already exists
    // 4. Create a new book entry
    // 5. Send response with the created book
    const { title, author, description, price, stock, genre } = req.body;

    if (
        [title, author, description, genre].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }
    

    const bookExists = await Book.findOne({ title, author });
    if (bookExists) {
        throw new ApiError(400, "Book already exists");
    }

    const bookData = await Book.create({ title, author, description, price, stock, genre });
    if (!bookData) {
        throw new ApiError(400, "Something went wrong while creating the book");
    }

    return res.status(201).json(
        new ApiResponse(201, { data: bookData }, "Book created successfully")
    );
});

// Update book details
const updateBook = asyncHandler(async (req, res) => {
    // 1. Get book ID from params
    // 2. Get new book data from the request body
    // 3. Verify the ID is valid
    // 4. Find the book by ID
    // 5. Update the book details
    // 6. Return the updated book details
    const bookId = req.params.id;
    const { title, author, description, price, stock, genre } = req.body;

    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid book ID");
    }
     if (
        [title, author, description, price, stock, genre].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(400, "Book not found");
    }

    const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { title, author, description, price, stock, genre },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedBook, "Book updated successfully")
    );
});

// Delete book
const deleteBook = asyncHandler(async (req, res) => {
    // 1. Get book ID from params
    // 2. Verify the book ID is valid
    // 3. Find the book by ID
    // 4. Delete the book from the database
    // 5. Send a success response
    const bookId = req.params.id;
    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "Invalid book ID");
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    await Book.findByIdAndDelete(bookId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Book deleted successfully")
    );
});

export {
    getAllBooks,
    getSingleBookById,
    addNewBook,
    updateBook,
    deleteBook,
};
