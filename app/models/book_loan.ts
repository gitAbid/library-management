import mongoose, { Schema } from "mongoose";
import IBookLoan from "../interfaces/book_loan";

const BookLoanSchema: Schema = new Schema<any>(
  {
    bookId: { type: String, required: true, index: true },
    username: { type: String, required: true, index: true },
    loanState: {
      type: String,
      enum: ["NEW", "ACCEPTED", "REJECTED","RETURNED"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBookLoan>("BookLoan", BookLoanSchema);
