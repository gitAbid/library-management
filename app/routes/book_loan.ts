import express from "express";
import { requestBookLoan, allBookLoanRequests,acceptLoanRequest } from "../contollers/book_loan_controller";

const bookLoanRouter = express.Router();

bookLoanRouter.post("/request/", requestBookLoan);

bookLoanRouter.get("/", allBookLoanRequests);

bookLoanRouter.post("/accept", acceptLoanRequest);




export { bookLoanRouter };
