import express, {Request, Response} from "express";
import {bookRouter} from "./route/book";
import {config} from "./config/config";
import {authorRouter} from "./route/author";
import {bookLoanRouter} from "./route/book_loan";
import {userRouter} from "./route/user";
import {authenticateToken} from "./middleware/auth";
import compression from "compression";

const app = express();

app.use(express.json());
app.use(compression())

//All api endpoints and router configuration
app.use("/books", authenticateToken, bookRouter);
app.use("/authors", authenticateToken, authorRouter);
app.use("/book-loans", authenticateToken, bookLoanRouter);
app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Library Management");
});

app.listen(config.server.port);
