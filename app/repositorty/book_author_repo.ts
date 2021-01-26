import BookAuthor from "../models/book_author";
import IBook from "../interfaces/book"
import IBookAuthor from "../interfaces/book_author";
import mongoose from "mongoose"
import author from "../models/author";

export default class BookAuthorRepositroy {
  findByBookId = (id: string, callback: Function) => {
    BookAuthor.find({bookId: id})
      .exec()
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  findByAuthorId = (id: string, callback: Function) => {
    BookAuthor.findById({ author: id })
      .exec()
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  findAllBook = (callback: Function) => {
    BookAuthor.find()
      .exec()
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  update = (author: IBookAuthor, callback: Function) => {
    author
      .save()
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };

  deleteByBookId =(bookId:string,callback:Function)=>{
    BookAuthor.deleteMany({bookId:bookId})
    .then((result)=>{
      callback(result,null)
    })
    .catch((error) => {
      console.log(error);
      callback(null, error);
    });
  }
}
