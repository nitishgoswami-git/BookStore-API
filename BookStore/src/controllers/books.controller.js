import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book} from "../models/book.model.js"

const getAllBooks = asyncHandler(async (req,res) =>{
    // query Book db for all books
    // if found send response 
    // else throw error
    try{
        const BookList = await Book.find({})
        if(BookList?.length<0){
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

     const {bookId} = req.params
     if(!isValidObjectId(bookId)){
        throw new ApiError(400,"BookId not valid")
     }

    const bookDetails = await Book.findOne({_id:bookId})
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
    const {title,author,year} = req.body
    if (
        [title,author,year].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, " All Fields are required")
    }

    const bookExists = await Book.findOne({"title":title, "author":author})
    if(!bookExists){
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

export {
  getAllBooks,
  getSingleBookById,
  addNewBook,
  updateBook,
  deleteBook,
}