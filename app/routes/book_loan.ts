import express from "express";
import BookLoanController from "../contollers/book_loan_controller";

const bookLoanRouter = express.Router();
const bookLoanController=new BookLoanController()

bookLoanRouter.post("/request/", bookLoanController.requestBookLoan);

bookLoanRouter.get("/", bookLoanController.getAllBookLoanRequests);

bookLoanRouter.post("/accept", bookLoanController.acceptLoanRequest);




export { bookLoanRouter };
