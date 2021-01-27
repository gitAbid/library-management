import { Document } from "mongoose";
export enum LoanState {
  MEMEBER,
  ADMIN,
}

export default interface IUser extends Document {
  name: String;
  username: string;
  password: string;
  role: string;
  profileImage: string;
}
