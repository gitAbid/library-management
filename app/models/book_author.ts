import mongoose, { Schema } from "mongoose";
import IBookAuthor from "../interfaces/book_author";

const BookAuthorSchema: Schema = new Schema<any>(
  {
    authorId: {
      type: String,
      index: true,
    },
    bookId: {
      type: String,
      index : true,
    },
  },
  {
    timestamps: true,
  }
);

BookAuthorSchema.index(
  {
    authorId: 1,
    bookId: 1,
  },
  {
    unique: true,
  }
);
export default mongoose.model<IBookAuthor>("BookAuthor", BookAuthorSchema);
