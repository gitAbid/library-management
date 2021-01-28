import express, { Request, Response } from "express";
import { bookRouter } from "./route/book";
import { config } from "./config/config";
import { authorRouter } from "./route/author";
import { bookLoanRouter } from "./route/book_loan";
import { userRouter } from "./route/user";
import mongoose from "mongoose";
import { authenticate } from "./middleware/auth";

const app = express();

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    console.log("Mongo Connected Success");
  })
  .catch((error) => {
    console.log("Error occurred", error);
  });

app.use(express.json());

app.use("/books", authenticate, bookRouter);
app.use("/authors", authenticate, authorRouter);
app.use("/book-loans", authenticate, bookLoanRouter);
app.use("/users", userRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Home page");
});

app.listen(config.server.port);
