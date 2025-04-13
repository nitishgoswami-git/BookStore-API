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
router.route("/details/:orderId").get(getOrderDetails) 
router.route("/history").get(getUserOrders)     
router.route("/cancel/:orderId").delete(cancelOrder)
// router.route("/cart/clear").delete(clearCartItems)
router.route("/place/:cartId").post(placeOrder)

export default router