import {Router} from "express"
import {getAllBooks,
    getSingleBookById,
    addNewBook,
    updateBook,
    deleteBook,} from "../controllers/books.controller.js"

const router = Router()

router.route("/list-books").get(getAllBooks)
router.route("/list-book-by-id/:id").get(getSingleBookById)
router.route("/add-new-book").post(addNewBook)
router.route("/update/:id").patch(updateBook)
router.route("/delete/:id").delete(deleteBook)


export default router