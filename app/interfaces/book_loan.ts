import { Document } from "mongoose";

export enum LoanState {
  NEW,
  ACCEPTED,
  REJECTED,
  RETURNED
}

export default interface IBookLoan extends Document {
  bookId: string;
  username: string;
  loanState: string;
}
