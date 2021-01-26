import mongoose, { Schema } from "mongoose";
import IBook from "../interfaces/book";

const BookSchema: Schema = new Schema<any>(
  {
    title: { type: String, required: true, index: true },
    isLoaned: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

BookSchema.index({ title: 1, author: 1, isLoaned: 1 });

export default mongoose.model<IBook>("Book", BookSchema);
