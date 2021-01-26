import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { bookRouter } from "./routes/book";
import { config } from "./config/config";
import { authorRouter } from "./routes/author";
import { bookLoanRouter } from "./routes/book_loan";
import mongoose from "mongoose";

const app = express();

mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    console.log("Mongo Connected Success");
  })
  .catch((error) => {
    console.log("Error occurred", error);
  });

app.use(bodyParser.json());

app.use("/books", bookRouter);
app.use('/authors',authorRouter)
app.use("/book-loans", bookLoanRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Home page");
});

app.listen(config.server.port);
