import { Document } from "mongoose";
export enum UserRole {
  MEMBER,
  ADMIN,
}

export default interface IUser extends Document {
  name: String;
  username: string;
  password: string;
  role: string;
  profileImage: string;
}
