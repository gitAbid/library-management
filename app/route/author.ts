import express from "express";
import AuthorController from "../contoller/author_controller";
import {authenticateRole} from "../middleware/auth";
import {UserRole} from "../interface/user";

const authorRouter = express.Router();
const authorController=new AuthorController()

authorRouter
   .route("/")
   .get(authenticateRole([UserRole[UserRole.MEMBER],UserRole[UserRole.ADMIN]]), authorController.allAuthors)
   .post(authenticateRole([UserRole[UserRole.ADMIN]]), authorController.addAuthor);

authorRouter
  .route("/:id")
  .get(authenticateRole([UserRole[UserRole.MEMBER],UserRole[UserRole.ADMIN]]), authorController.getAuthorById)
  .patch(authenticateRole([UserRole[UserRole.ADMIN]]), authorController.patchAuthor)
  .put(authenticateRole([UserRole[UserRole.ADMIN]]), authorController.updateAuthor)
  .delete(authenticateRole([UserRole[UserRole.ADMIN]]), authorController.deleteAuthor);

authorRouter
  .route("/:authorId/books")
  .get(authenticateRole([UserRole[UserRole.MEMBER],UserRole[UserRole.ADMIN]]), authorController.getAuthorBooks)

export { authorRouter };
