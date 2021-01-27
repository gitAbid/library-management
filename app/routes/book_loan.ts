import express from "express";
import BookLoanController from "../contollers/book_loan_controller";

const bookLoanRouter = express.Router();
const bookLoanController=new BookLoanController()

bookLoanRouter.post("/:bookId/request/", bookLoanController.requestBookLoan);

bookLoanRouter.post("/:bookId/return/", bookLoanController.returnBookLoan);

bookLoanRouter.get("/", bookLoanController.getAllBookLoanRequests);

bookLoanRouter.post("/:loanId/accept", bookLoanController.acceptLoanRequest);

bookLoanRouter.post("/:loanId/reject", bookLoanController.rejectLoanRequest);


export { bookLoanRouter };
