import express from "express";
import {
  addBook,
  deleteBook,
  allBooks,
  getBookById,
  patchBook,
  updateBook,
  getBookAuthors
} from "../contollers/book_controller";

const bookRouter = express.Router();

bookRouter
  .route("/")
  .get(allBooks)
  .post(addBook);

bookRouter
  .route("/:id")
  .get(getBookById)
  .patch(patchBook)
  .put(updateBook)
  .delete(deleteBook);

bookRouter
  .route("/:bookId/authors")
  .get(getBookAuthors)
export { bookRouter };
