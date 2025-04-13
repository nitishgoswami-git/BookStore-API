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
router.route("/details").get(getCart) 
router.route("/add/:bookId").post(addItemToCart)     
router.route("/remove/:bookId").delete(removeItemFromCart)
router.route("/clear").delete(clearCartItems)

export default router