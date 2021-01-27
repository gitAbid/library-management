import {Request, Response} from "express";
import mongoose from "mongoose";
import IBook from "../interfaces/book";
import IBookLoan, {LoanState} from "../interfaces/book_loan";
import BookLoan from "../models/book_loan";
import BookLoanRepository from "../repositorty/book_loan_repo";
import BookRepository from "../repositorty/book_repo";
import {handleError, handleFailed, handleResponseMessage, handleSuccess} from "../utils/util";

const bookLoanRepo = new BookLoanRepository();
const bookRep = new BookRepository();

export default class BookLoanController {
    requestBookLoan = (req: Request, res: Response) => {
        let {bookId} = req.params;

        let username = res.locals.user.username;
        if (username == null) {
            handleResponseMessage(res, 404, "Unauthorized", "Credentials not valid")
        } else {
            bookLoanRepo.findNewBookLoanByBookIdAndUsername(
                bookId,
                username,
                (loan: IBookLoan, err: any) => {
                    if (err) {
                        handleError(res, err);
                    } else if (loan) {
                        console.log(loan);
                        handleFailed(res, `Already pending request exists for book`);
                    } else {
                        bookRep.findById(bookId, (book: IBook, err: any) => {
                            if (err) {
                                handleError(res, err);
                            } else if (book) {
                                if (!isBookAvailableForLoan(book)) {
                                    handleFailed(res, "No more book is available for loan");
                                } else {
                                    const bookLoan = new BookLoan({
                                        _id: new mongoose.Types.ObjectId(),
                                        bookId: book.id,
                                        username: username,
                                    });

                                    bookLoanRepo.update(bookLoan, (loan: IBookLoan, err: any) => {
                                        if (err) {
                                            handleError(res, err);
                                        } else {
                                            handleSuccess(res, "Book loan request successful", loan);
                                        }
                                    });
                                }
                            } else {
                                handleFailed(res, `No book found with id ${bookId}`);
                            }
                        });
                    }
                }
            );
        }
    };
    returnBookLoan = (req: Request, res: Response) => {
        let {loanId} = req.params;

        let username = res.locals.user.username;
        if (username == null) {
            handleResponseMessage(res, 404, "Unauthorized", "Credentials not valid")
        } else {
            bookLoanRepo.findById(
                loanId,
                (loan: IBookLoan, err: any) => {
                    if (err) {
                        handleError(res, err);
                    } else if (loan) {
                        if (loan.loanState === LoanState[LoanState.ACCEPTED]) {
                            bookRep.findById(loan.bookId, (book: IBook, err: any) => {
                                if (err) {
                                    handleError(res, err);
                                } else if (book) {
                                    book.loanCount = book.loanCount - 1;
                                    bookRep.update(book, (updatedBook: IBook, err: any) => {
                                        if (err) {
                                            handleError(res, err);
                                        } else {
                                            loan.loanState = LoanState[LoanState.RETURNED];
                                            bookLoanRepo.update(
                                                loan,
                                                (updateLoan: IBookLoan, err: any) => {
                                                    if (err) {
                                                        handleError(res, err);
                                                    } else {
                                                        handleSuccess(res, "Book return successful", loan);
                                                    }
                                                }
                                            );
                                        }
                                    });
                                } else {
                                    handleFailed(res, `Book with id ${book._id} no longer available`);
                                }
                            });
                        } else {
                            handleFailed(
                                res,
                                "Book loan in not ACCEPTED state. Failed to returned the book"
                            );
                        }
                    } else {
                        handleFailed(
                            res,
                            `No loan found for loanId ${loanId} for username ${username}`
                        );
                    }
                }
            );
        }
    };

    getAllBookLoanRequests = (req: Request, res: Response) => {
        bookLoanRepo.findAllBookLoans((loans: Array<IBookLoan>, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                res.status(200).json(loans);
            }
        });
    };

    acceptLoanRequest = (req: Request, res: Response) => {
        let {loanId} = req.params;

        bookLoanRepo.findById(loanId, function (loan: IBookLoan, err: any) {
            if (err) {
                handleError(res, err);
            } else if (loan) {
                if (loan.loanState === LoanState[LoanState.NEW]) {
                    bookRep.findById(loan.bookId, (book: IBook, err: any) => {
                        if (err) {
                            handleError(res, err);
                        }

                        if (book && isBookAvailableForLoan(book)) {
                            book.loanCount = book.loanCount + 1;
                            bookRep.update(book, (book: IBook, err: any) => {
                                loan.loanState = LoanState[LoanState.ACCEPTED];

                                bookLoanRepo.update(loan, (loan: IBookLoan, err: any) => {
                                    if (err) {
                                        handleError(res, err);
                                    } else {
                                        handleSuccess(res, `Loan application accepted`, loan);
                                    }
                                });
                            });
                        } else {
                            handleFailed(res, `Book is no longer available with for loan`);
                        }
                    });
                } else {
                    handleFailed(
                        res,
                        "Book loan in not NEW state. Failed to ACCEPT book loan"
                    );
                }
            } else {
                handleFailed(res, `No book loan found to accept with id ${loanId}`);
            }
        });
    };

    rejectLoanRequest = (req: Request, res: Response) => {
        let {loanId} = req.params;

        bookLoanRepo.findById(loanId, function (loan: IBookLoan, err: any) {
            if (err) {
                handleError(res, err);
            } else if (loan) {
                if (loan.loanState === LoanState[LoanState.NEW]) {
                    loan.loanState = LoanState[LoanState.REJECTED];
                    bookLoanRepo.update(loan, (loan: IBookLoan, err: any) => {
                        if (err) {
                            handleError(res, err);
                        } else {
                            handleSuccess(res, `Loan application rejected`, loan);
                        }
                    });
                } else {
                    handleFailed(
                        res,
                        "Book loan in not NEW state. Failed to REJECT book loan"
                    );
                }
            } else {
                handleFailed(res, `No valid loan found to reject with id ${loanId}`);
            }
        });
    };
}

function isBookAvailableForLoan(book: IBook) {
    return book.inventoryCount > book.loanCount;
}
