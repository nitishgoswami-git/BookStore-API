import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book, Book} from "../models/book.model.js"
import {Cart } from "../models/cart.model.js"
import { User } from "../models/user.model.js"
import { isValidObjectId } from "mongoose";




const verifyUser = asyncHandler(async(userId)=>{
    if(!userId){
        throw new ApiError(404, "userId not received")
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"User Id is not valid")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404,"User not Found")
    }
    return user

    
})



const getCart = asyncHandler(async(req,res)=>{
    // 1. Extract the user ID from the authenticated request
    // 2. Validate that the user ID exists
    // 3. Find the user's cart in the database
    // 4. Populate cart items with book details
    // 5. If no cart is found, return an empty cart
    // 6. Send the cart data as a response

    const userId = req.user?._id
    await verifyUser(userId)
  
    const cart = await Cart.findById(userId)

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Cart Fetched Successfully"
        )
    )

})

const addItemToCart = asyncHandler(async (req, res) => {
    // 1. Extract the user ID from the authenticated request
    // 2. Validate that the user ID exists
    // 3. Validate that the book ID exists and is valid
    // 4. Check if the book is already in the cart then increse the quantity
    // 5. If the book is not in the cart, add it to the cart
    // 6. Send a success response with the updated cart

    const userId = req.user?._id;
    const bookId = req.params.bookId;

    await verifyUser(userId);

    if (!isValidObjectId(bookId)) {
        throw new ApiError(400, "BookId not valid");
    }

    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.equals(bookId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({ product: bookId, quantity: 1 });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Item added to cart successfully"
        )
    );
});

const removeItemFromCart = asyncHandler (async(req,res)=>{
    // 1. Extract the user ID from the authenticated request
    // 2. Validate that the user ID exists
    // 3. Validate that the book ID exists and is valid
    // 4. Find the user's cart in the database
    // 5. Remove the item from the cart
    // 6. Save the cart
    // 7. Send a success response with the updated cart
    const userId = req.user?._id
    const bookId = req.params.bookId
    await verifyUser(userId)
    if(!isValidObjectId(bookId)){
        throw new ApiError(400,"BookId not valid")
    }  
    const cart = await Cart.findOne({user: userId})
    if(!cart){
        throw new ApiError(404,"Cart not found")
    }
    const itemIndex = cart.items.findIndex(item => item.product.equals(bookId));
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Item removed from cart successfully"
        )
    )
})

const clearCartItems = asyncHandler (async(req,res)=>{
    // 1. Extract the user ID from the authenticated request
    // 2. Validate that the user ID exists
    // 3. Find the user's cart in the database
    // 4. Clear all items from the cart
    // 5. Save the cart
    // 6. Send a success response with the updated cart
    const userId = req.user?._id
    await verifyUser(userId)
    const cart = await Cart.findOne({user: userId})
    if(!cart){
        throw new ApiError(404,"Cart not found")
    }

    await Cart.findByIdAndUpdate(userId, { items: [], amount: 0 }, { new: true });

    return res.status(200).json(
        new ApiResponse(
        200,
        null,
        "Cart cleared successfully"
     )
    )
})


export {
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    clearCartItems
        } 