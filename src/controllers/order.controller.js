import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book} from "../models/book.model.js"
import {Cart } from "../models/cart.model.js"
import { verifyUser } from "../validators/user.validator.js"
import { isValidObjectId } from "mongoose";
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"

const getOrderDetails = asyncHandler(async (req, res) => {
    // 1. Check if the user is authenticated
    // 2. Extract the order ID from the request parameters
    // 3. Validate the order ID
    // 4. Fetch the order from the database using the order ID
    // 5. If the order does not exist, throw an error
    // 6. Check if the order belongs to the authenticated user or if the user is an admin
    // 7. If not authorized, throw a permission error
    // 8. Populate necessary order fields (e.g., items, book details, shipping info)
    // 9. Send the order details in the response

    const orderId  = req.params.orderId;
    const userId = req.user._id;

    await verifyUser(userId);


    if (!orderId) {
        throw new ApiError(400, "Order ID not provided");
    }
    if (!isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    const order = await Order.findById(orderId)
    if(!order){
        throw new ApiError(404, "Order Not Found")
    }
    if (order.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Permission Denied");
    }
    

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order Details Fetched"
        )
    )
})

const getUserOrders = asyncHandler(async(req,res)=>{
    // 1. Check if the user is authenticated
    // 2. Extract the user ID from the request
    // 3. Validate the user ID
    // 4. Fetch the user's orders from the database
    // 5. If no orders are found, return an empty array    

    const userId = req.user._id;
    await verifyUser(userId)
    const orders = await Order.find({ userId })

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            orders,
            "Orders Fetched"
        )
    )
})

const cancelOrder = asyncHandler(async (req, res) => {
    // 1. Check if the user is authenticated
    // 2. Extract the order ID from the request parameters
    // 3. Validate the order ID
    // 4. Fetch the order from the database using the order ID
    // 5. If the order does not exist, throw an error
    // 6. Check if the order belongs to the authenticated user or if the user is an admin
    // 7. If not authorized, throw a permission error
    // 8. Update the order status to "CANCELLED"

    const { orderId } = req.params;
    const userId = req.user._id;
    await verifyUser(userId)
    if (!orderId) {
        throw new ApiError(400, "Order ID not provided");
    }
    if (!isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID");
    }  

    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(404, "Order Not Found");
    }
    if (order.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Permission Denied");
    }
    await Order.findByIdAndUpdate(orderId, { status: 'CANCELLED' })
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order Cancelled"
        )
    )
})


const placeOrder = asyncHandler(async (req, res) => {
    // 1. validate UserId
    // 2. validate CartId
    // 3. validate Address
    // 4. validate Amount
    // 5. create Order
    // 6. clear Cart
    // 7. send response

    const userId = req.user._id;
    await verifyUser(userId)
    const cartId = req.params.cartId

    if (!cartId) {
        throw new ApiError(400, "Cart ID not provided");
    }
    if (!isValidObjectId(cartId)) {
        throw new ApiError(400, "Invalid Cart ID");
    }

    const user = await User.findById(userId)

    if (!user.address) {
        throw new ApiError(400, "Address not provided");
    }
    const cart = await Cart.findById(cartId)
    
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    if (!cart.amount) {
        throw new ApiError(400, "Amount not provided");
    }
    if (cart.userId.toString() !== userId.toString()) {
        console.log(cart.userId.toString(), userId.toString())
        throw new ApiError(403, "Permission Denied");
    }
    const items = cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity
    }))

    const { address } = user;
    const { amount } = cart;

    const order = await Order.create({
        userId,
        items,
        address,
        amount
    })
    await Cart.findByIdAndDelete(cartId);
    return res.status(201)
    .json(
        new ApiResponse(
            201,
            order,
            "Order Placed"
        )
    )
})

export{
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    // updateOrderStatus,
    placeOrder   
}