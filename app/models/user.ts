import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/user";
import { usernameValidator } from "../utils/util";

const UserSchema: Schema = new Schema<any>(
  {
    name: { type: String, required: true, index: true },
    username: {
      type: String,
      required: true,
      index: true,
      validate: {
        validator: (username: string) => {
          return usernameValidator(mongoose.model("User"), username);
        },
      },
    },
    password: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["MEMBER", "ADMIN"],
      index: true,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
