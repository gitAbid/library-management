import IAuthor from "../interfaces/author";
import Author from "../models/author";
import mongoose from "mongoose";
export default class AuthorRepsoitory {
  findById = (id: string, callback: Function) => {
    Author.findById(id)
      .exec()
      .then((author) => {
        callback(author, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  findAllBook = (callback: Function) => {
    Author.find()
      .exec()
      .then((authors) => {
        callback(authors, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  findAuthorByIds = (
    ids: Array<mongoose.Types.ObjectId>,
    callback: Function
  ) => {
    Author.find({
      _id: { $in: ids },
    })
      .exec()
      .then((authors) => {
        callback(authors, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  update = (author: IAuthor, callback: Function) => {
    author
      .save()
      .then((savedAuthor) => {
        callback(savedAuthor, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };
}
