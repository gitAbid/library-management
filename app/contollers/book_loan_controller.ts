import { Request, Response } from "express";
import mongoose from "mongoose";
import IBook from "../interfaces/book";
import IBookLoan from "../interfaces/book_loan";
import BookLoan from "../models/book_loan";
import BookLoanRepositroy from "../repositorty/book_loan_repo";
import BookRepositroy from "../repositorty/book_repo";

const bookLoanRepo = new BookLoanRepositroy();
const bookRep = new BookRepositroy();

export const requestBookLoan = (req: Request, res: Response) => {
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

export const allBookLoanRequests = (req: Request, res: Response) => {
  bookLoanRepo.findAllBookLoans((loans: Array<IBookLoan>, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      res.status(200).json(loans)
    }
  });
};

export const acceptLoanRequest = (req: Request, res: Response) => {
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

export const rejectLoanRequest = (req: Request, res: Response) => {};

function handleSuccess(
  res: Response<any, Record<string, any>>,
  message: string,
  data: any
) {
  res.status(200).json({
    status: "SUCCESS",
    message: message,
    data: data,
  });
}

function handleFailed(
  res: Response<any, Record<string, any>>,
  message: string
) {
  res.status(200).json({
    status: "FAILED",
    message: message,
    data: null,
  });
}

function handleError(res: Response<any, Record<string, any>>, err: any) {
  res.status(500).json({
    message: err.message,
    error: err,
    data: null,
  });
}
