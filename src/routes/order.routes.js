import { Router } from "express"
import {
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    // updateOrderStatus,
    placeOrder
        } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"



const router = Router()

router.use(verifyJWT)
router.route("/cart/:orderId").get(getOrderDetails) 
router.route("/cart/history/:orderId").post(getUserOrders)     
router.route("/cart/cancel/:orderId").delete(cancelOrder)
// router.route("/cart/clear").delete(clearCartItems)

export default router