import BookAuthor from "../models/book_author";
import IBookAuthor from "../interfaces/book_author";

export default class BookAuthorRepository {
  findByBookId = (id: string, callback: Function) => {
    BookAuthor.find({ bookId: id })
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
    BookAuthor.find({ authorId: id })
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

  deleteByBookId = (bookId: string, callback: Function) => {
    BookAuthor.deleteMany({ bookId: bookId })
      .then((result) => {
        callback(result, null);
      })
      .catch((error) => {
        console.log(error);
        callback(null, error);
      });
  };
}
