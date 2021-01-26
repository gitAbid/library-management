import mongoose, { Schema } from "mongoose";
import IBook from "../interfaces/book";
import { forignKeyValidator } from "../utils/util";

const BookSchema: Schema = new Schema<any>(
  {
    title: { type: String, required: true, index: true },
    authors: [
      {
        type: String,
        validate: {
          validator: (id: string) => {
            return forignKeyValidator(mongoose.model("Author"), id);
          },
        },
      },
    ],
    isLoaned: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

BookSchema.index({ title: 1, author: 1, isLoaned: 1 });

export default mongoose.model<IBook>("Book", BookSchema);
