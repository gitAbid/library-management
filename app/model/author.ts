import mongoose, { Schema } from "mongoose";
import IAuthor from "../interface/author";
import IBook from "../interface/book";

const AuthorSchema: Schema = new Schema<any>(
  {
    name: { type: String, required: true, index: true },
    age: { type: String, required: true },
    birthday: { type: Date, required: true },
    country: { type: String, required: true, index: true },
    bio: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);
AuthorSchema.post("remove", function (author) {
  mongoose
    .model("BookAuthor")
    .deleteMany({ authorId: author._id })
    .exec()
    .then(() => {
      console.log(
        `Clealer relation for book author for authorId ${author._id}`
      );
    })
    .catch((err) => {
      console.error(
        `Error occurred while cleaning up author book relation for removed authorId ${author._id}`,
        err
      );
    });
});

export default mongoose.model<IAuthor>("Author", AuthorSchema);
