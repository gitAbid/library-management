import { Request, Response } from "express";
import mongoose from "mongoose";
import IBook from "../interfaces/book";
import IBookLoan from "../interfaces/book_loan";
import BookLoan from "../models/book_loan";
import BookLoanRepositroy from "../repositorty/book_loan_repo";
import BookRepositroy from "../repositorty/book_repo";
import { handleError, handleFailed, handleSuccess } from "../utils/util";

const bookLoanRepo = new BookLoanRepositroy();
const bookRep = new BookRepositroy();

export default class BookLoanController {
  requestBookLoan = (req: Request, res: Response) => {
    let { bookId } = req.body;

    //from jwt token
    let username = "dummyUser";

    bookRep.findById(bookId, (book: IBook, err: any) => {
      if (err) {
        handleError(res, err);
      } else if (book) {
        if (book.isLoaned === true) {
          handleFailed(res, "Book is already loaned");
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
    let { loanId } = req.body;

    bookLoanRepo.findById(loanId, function (loan: IBookLoan, err: any) {
      if (err) {
        handleError(res, err);
      } else if (loan) {
        bookRep.findById(loan.bookId, (book: IBook, err: any) => {
          if (err) {
            handleError(res, err);
          }

          if (book && book.isLoaned === false) {
            book.isLoaned = true;

            bookRep.update(book, (book: IBook, err: any) => {
              loan.isLoanAccepeted = true;

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
        handleFailed(res, `No Loan found with id ${loanId}`);
      }
    });
  };

  rejectLoanRequest = (req: Request, res: Response) => {};
}
