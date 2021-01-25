import mongoose, { Schema } from "mongoose";
import IBookLoan from "../interfaces/book_loan";
import Book from "../models/book";

const BookLoanSchema: Schema = new Schema<any>(
  {
    bookId: { type: String, required: true, index: true },
    username: { type: String, required: true, index: true },
    isLoanAccepeted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

BookLoanSchema.index({ title: 1, author: 1, isLoaned: 1 });


export default mongoose.model<IBookLoan>("BookLoan", BookLoanSchema);
