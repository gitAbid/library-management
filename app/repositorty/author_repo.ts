import IAuthor from "../interfaces/author";
import Author from "../models/author";
import mongoose from "mongoose";
export default class AuthorRepository {
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

  findAuthorsByIds = (
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

  deleteById = (id: string, callback: Function) => {
    Author.findByIdAndDelete(id)
      .exec()
      .then((author) => {
        callback(author, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };
  
  findByIdAndUpdate = (id: string, author: IAuthor, callback: Function) => {
    Author.findOneAndUpdate(
      { _id: id },
      { $set: author },
      { new: true, runValidators: true }
    )
      .then((updatedAuthor) => {
        callback(updatedAuthor, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };
}
