import express from "express"
import cors from "cors"


const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

import bookRouter from "./routes/book.routes.js"
import orderRouter from "./routes/order.routes.js"  
import userRouter from "./routes/user.routes.js"
// import authRouter from "./routes/auth.routes.js"
// import reviewRouter from "./routes/review.routes.js"
import cartRouter from "./routes/cart.routes.js"

app.use("/api/v1/books",bookRouter)
app.use("/api/v1/orders",orderRouter)
app.use("/api/v1/users",userRouter)
// app.use("/api/v1/auth",authRouter)
// app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/carts",cartRouter)

export {app}