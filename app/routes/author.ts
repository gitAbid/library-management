import express from "express";
import AuthorController from "../contollers/author_controller";

const authorRouter = express.Router();
const authorController=new AuthorController()

authorRouter
   .route("/")
   .get(authorController.allAuthors)
   .post(authorController.addAuthor);

authorRouter
  .route("/:id")
  .get(authorController.getAuthorById)
  .patch(authorController.patchAuthor)
  .put(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

authorRouter
  .route("/:authorId/books")
  .get(authorController.getAuthorBooks)

export { authorRouter };
