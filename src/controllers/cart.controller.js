import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book} from "../models/book.model.js"
import { isValidObjectId } from "mongoose";


const getCart = asyncHandler(async(req,res)=>{
    // 1. Extract the user ID from the authenticated request
    // 2. Validate that the user ID exists
    // 3. Find the user's cart in the database
    // 4. Populate cart items with book details
    // 5. If no cart is found, return an empty cart
    // 6. Send the cart data as a response

    

})




export {
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    clearCartItems
        } 