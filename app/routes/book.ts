import express from "express";
import {
  addBook,
  deleteBook,
  allBooks,
  getBookById,
  patchBook,
  updateBook,
} from "../contollers/book_controller";

const bookRouter = express.Router();

bookRouter.get("/", allBooks);
bookRouter.get("/:id", getBookById);
bookRouter.post("/", addBook);
bookRouter.patch("/:id", patchBook);
bookRouter.put("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);

export { bookRouter };
