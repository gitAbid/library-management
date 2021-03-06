import express from "express";
import BookController from "../controller/book_controller";
import {authenticateRole} from "../middleware/auth";
import {UserRole} from "../interface/user";

const bookRouter = express.Router();
const bookController = new BookController();
bookRouter
    .route("/")
    .get(authenticateRole([UserRole[UserRole.MEMBER], UserRole[UserRole.ADMIN]]), bookController.getAllBooks)
    .post(authenticateRole([UserRole[UserRole.ADMIN]]), bookController.addBook);

bookRouter
    .route("/:bookId")
    .get(authenticateRole([UserRole[UserRole.MEMBER],UserRole[UserRole.ADMIN]]),bookController.getBookById)
    .patch(authenticateRole([UserRole[UserRole.ADMIN]]),bookController.patchBook)
    .put(authenticateRole([UserRole[UserRole.ADMIN]]),bookController.updateBook)
    .delete(authenticateRole([UserRole[UserRole.ADMIN]]),bookController.deleteBook);

bookRouter
    .route("/:bookId/authors")
    .get(authenticateRole([UserRole[UserRole.MEMBER],UserRole[UserRole.ADMIN]]),bookController.getBookAuthors)
export {bookRouter};
