import express from "express";
import BookLoanController from "../contollers/book_loan_controller";
import {authenticateRole} from "../middleware/auth";
import {UserRole} from "../interfaces/user";

const bookLoanRouter = express.Router();
const bookLoanController = new BookLoanController()

bookLoanRouter.post("/:bookId/request/", authenticateRole([UserRole[UserRole.MEMBER],
    UserRole[UserRole.ADMIN]]), bookLoanController.requestBookLoan);

bookLoanRouter.post("/:bookId/return/", authenticateRole([UserRole[UserRole.ADMIN]]),
    bookLoanController.returnBookLoan);

bookLoanRouter.get("/", authenticateRole([UserRole[UserRole.MEMBER], UserRole[UserRole.ADMIN]]),
    bookLoanController.getAllBookLoanRequests);

bookLoanRouter.post("/:loanId/accept", authenticateRole([UserRole[UserRole.ADMIN]]),
    bookLoanController.acceptLoanRequest);

bookLoanRouter.post("/:loanId/reject", authenticateRole([UserRole[UserRole.ADMIN]]),
    bookLoanController.rejectLoanRequest);


export {bookLoanRouter};
