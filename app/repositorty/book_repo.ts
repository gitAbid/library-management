import IBook from "../interfaces/book";
import Book from "../models/book";
import mongoose from "mongoose";

export default class BookRepositroy {
  findById = (id: string, callback: Function) => {
    Book.findById(id)
      .exec()
      .then((book) => {
        callback(book, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  findAllBook = (callback: Function) => {
    Book.find()
      .exec()
      .then((books) => {
        callback(books, null);
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
    Book.find({
      _id: { $in: ids },
    })
      .exec()
      .then((books) => {
        callback(books, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };
  update = (book: IBook, callback: Function) => {
    book
      .save()
      .then((savedBook) => {
        callback(savedBook, null);
      })
      .catch((error) => {
        console.log("OnUpdateCall",error);
        callback(null, error);
      });
  };

  deleteById=(id:string,callback:Function)=>{
    Book.findByIdAndDelete(id)
    .exec()
    .then((book) => {
      callback(book, null);
    })
    .catch((error) => {
      console.log(error);
      callback(null, error);
    });
  }
}
