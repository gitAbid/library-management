import express from "express";
import { addAuthor, allAuthors } from "../contollers/author_controller";

const authorRouter = express.Router();

authorRouter.route("/").get(allAuthors).post(addAuthor);

// authorRouter
//   .route("/:id")
//   .get(getBookById)
//   .patch(patchBook)
//   .put(updateBook)
//   .delete(deleteBook);

export { authorRouter };
