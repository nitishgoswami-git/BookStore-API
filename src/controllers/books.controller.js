import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book} from "../models/book.model.js"
import { isValidObjectId } from "mongoose";

const getAllBooks = asyncHandler(async (req,res) =>{
    // query Book db for all books
    // if found send response 
    // else throw error
    try{
        const BookList = await Book.find({})
        if(BookList?.length === 0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "No book Found"
                )
            )
        }
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                "data" : BookList
                },
                "Book found Successfully"
            )
        )

    }catch(err){
        throw new ApiError(400,"Something went wrong while fetching")
    }
});

const getSingleBookById = asyncHandler(async (req,res)=>{
     // get id from req.params
     // verify id
     // find book based on id
     // if found send res
     // else throw error
     console.log(req.params);
     const bookId = req.params.id 
     console.log(bookId)
     if(!isValidObjectId(bookId)){
        throw new ApiError(400,"BookId not valid")
     }

    const bookDetails = await Book.findById(bookId)
    if(!bookDetails){
            throw new ApiError(400,"Book Not Found")
    }
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    "data":bookDetails
                },
                "Book Found Successfully"
            )
        )
})

const addNewBook = asyncHandler(async(req,res)=>{
    // get data 
    // verify if empty
    // check if book exists
    // create entry
    // send response
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
      }
    const {title,author,year} = req.body
    console.log(title,author,year)
    if (
        [title,author,year].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, " All Fields are required")
    }

    const bookExists = await Book.findOne({"title":title, "author":author})
    if(bookExists){
        throw new ApiError(400,"Book Already Exists")
    }
    const bookData = await Book.create({
        "title": title,
        "author":author,
        "year": year
    })
    if(!bookData){
        throw new ApiError(400,"Something went wrong while creating book")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                "data": bookData
            },
            "Book Created Successfully"
        )
    )
})

const updateBook = asyncHandler (async(req,res)=>{
    // get id
    // get newData
    // verify id
    // find book
    // update book
    // return res

    const bookId = req.params.id
    const {title,author,year} = req.body

    if(!isValidObjectId(bookId)){
        throw new ApiError(400,"Not a valid Id")
    }

    if (
        [title,author,year].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, " All Fields are required")
    }

    const book = await Book.findById(bookId)
    if(!book){
        throw new ApiError(400,"Book not found")
    }
    const updatedBook = await Book.findByIdAndUpdate(bookId,{
        title,
        author,
        year
    },{new:true})

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            updatedBook,
            "update Successful"

        )
    )
})

const deleteBook = asyncHandler (async(req,res)=>{
    // get book Id
    // verify bookId
    // find book
    // delete
    // return res

    const bookId = req.params.id
    if(!isValidObjectId(bookId)){
        throw new ApiError(400,"Not a valid Id")
    }

    const book = await Book.findById(bookId)
    if(!book){
        throw new ApiError(404,"Book Not found")
    }

    await Book.findByIdAndDelete(bookId)
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Book deleted Successfully"
        )
    )
})
export {
  getAllBooks,
  getSingleBookById,
  addNewBook,
  updateBook,
  deleteBook,
}