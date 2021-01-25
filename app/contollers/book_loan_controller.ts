import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/book";
import BookLoan from "../models/book_loan";

export const requestBookLoan = (req: Request, res: Response) => {
  let { bookId } = req.body;

  //from jwt token
  let username = "dummyUser";

  Book.findById(bookId)
    .exec()
    .then((book) => {
      if (book) {
        if (book.isLoaned === true) {
          return res.status(200).json({
            status: "Invalid Request",
            message: "Book is already loaned",
          });
        } else {
          const bookLoan = new BookLoan({
            _id: new mongoose.Types.ObjectId(),
            bookId: book.id,
            username: username,
          });
          bookLoan.save().then((laon) => {
            return res.status(200).json({
              status: "Success",
              message: "Book loan request successful",
              requestId: laon._id,
            });
          });
        }
      } else {
        return res.status(404).json({
          message: `No book found with id ${bookId}`,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const allBookLoanRequests = (req: Request, res: Response) => {
  BookLoan.find()
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const acceptLoanRequest = (req: Request, res: Response) => {
  let { loanId } = req.body;

  BookLoan.findById(loanId)
    .exec()
    .then((loan) => {
      if (loan) {
        Book.findById(loan.bookId)
          .exec()
          .then((book) => {
            if (book && book.isLoaned===false) {
              book.isLoaned = true;
              book.save().then(() => {
                loan.isLoanAccepeted = true;
                loan
                  .save()
                  .then(() => {
                    return res.status(200).json({
                      status: "Success",
                      message: `Loan application with id ${loanId} is accepted`,
                    });
                  })
                  .catch((error) => {
                    console.error(error);
                    res.status(500).json({
                      message: error.message,
                      error: error,
                    });
                  });
              });
            } else {
              return res.status(404).json({
                status: "Failed",
                message: `Book is no longer available with for loan for request with id ${loanId}`,
              });
            }
          })
          .catch((error: any) => {
            console.log(error);
            res.status(500).json({
              message: error.message,
              error: error,
            });
          });
      } else {
        return res.status(404).json({
          status: "Failed",
          message: `No Loan found with id ${loanId}`,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const rejectLoanRequest = (req: Request, res: Response) => {};
