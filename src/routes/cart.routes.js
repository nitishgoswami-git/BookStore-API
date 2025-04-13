import { Router } from "express"
import {
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    clearCartItems
        } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"



const router = Router()

router.use(verifyJWT)
router.route("/cart").get(getCart) 
router.route("/cart/add/:bookId").post(addItemToCart)     
router.route("/cart/remove/:bookId").delete(removeItemFromCart)
router.route("/cart/clear").delete(clearCartItems)

export default router