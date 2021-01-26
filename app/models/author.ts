import mongoose, { Schema } from "mongoose";
import IAuthor from "../interfaces/author";
import IBook from "../interfaces/book";

const AuthorSchema: Schema = new Schema<any>(
  {
    name: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAuthor>("Author", AuthorSchema);
