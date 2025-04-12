import { Router } from "express"
import {
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    clearCartItems
        } from "../controllers/cart.controller.js";



const router = Router()

router.use(verifyJWT)
router.route("/cart").get(getCart) 
router.route("/cart/add").post(addItemToCart)     
router.route("/cart/remove/:id").delete(removeItemFromCart)
router.route("/cart/clear").delete(clearCartItems)

export default router