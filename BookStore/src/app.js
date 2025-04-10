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

app.use("/api/v1/books",bookRouter)

export {app}