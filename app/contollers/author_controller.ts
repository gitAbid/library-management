import { Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/author";
import BookAuthorRepositroy from "../repositorty/book_author_repo";
import AuthorRepsoitory from "../repositorty/author_repo";
import { handleError } from "../utils/util";
import IAuthor from "../interfaces/author";
import IBook from "../interfaces/book";
import IBookAuthor from "../interfaces/book_author";
import BookRepositroy from "../repositorty/book_repo";

const authorRepo = new AuthorRepsoitory();
const bookAuthorRepo = new BookAuthorRepositroy();
const bookRepo = new BookRepositroy();

export default class AuthorController {
  allAuthors = (req: Request, res: Response) => {
    authorRepo.findAllBook((books: Array<IAuthor>, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        res.status(200).json(books);
      }
    });
  };

  addAuthor = (req: Request, res: Response) => {
    const author = new Author(req.body);
    authorRepo.update(author, (updatedAuthor: IAuthor, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        res.status(201).json(updatedAuthor);
      }
    });
  };

  getAuthorById = (req: Request, res: Response) => {
    let { id } = req.params;
    authorRepo.findById(id, (author: IAuthor, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        res.status(200).json(author);
      }
    });
  };

  updateAuthor = (req: Request, res: Response) => {
    let { id } = req.params;
    let reqAuthor = new Author(req.body);

    authorRepo.findById(id, (author: IAuthor, err: any) => {
      if (err) {
        handleError(res, err);
      } else if (author) {
        updateAuthorInfo(author, reqAuthor);
        authorRepo.update(author, (updatedAuthor: IAuthor, err: any) => {
          if (err) {
            handleError(res, err);
          } else {
            return res.status(200).json(updatedAuthor);
          }
        });
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    });
  };

  deleteAuthor = (req: Request, res: Response) => {
    let { id } = req.params;

    authorRepo.deleteById(id, (result: any, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        res.status(200).json({
          message: `Author deleted with id ${id}`,
        });
      }
    });
  };

  patchAuthor = (req: Request, res: Response) => {
    let { id } = req.params;
    const author = new Author(req.body);
    author._id = id;
    authorRepo.findByIdAndUpdate(id, author, (updateBook: IBook, err: any) => {
      if (err) {
        handleError(res, err);
      } else if (author) {
        return res.status(200).json(updateBook);
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    });
  };

  getAuthorBooks = (req: Request, res: Response) => {
    const { authorId } = req.params;
    bookAuthorRepo.findByAuthorId(
      authorId,
      (bookAuthors: Array<IBookAuthor>, err: any) => {
        if (err) {
          handleError(res, err);
        } else {
          bookRepo.findBooksByIds(
            bookAuthors?.map((bookAuthor) =>
              mongoose.Types.ObjectId(bookAuthor.bookId)
            ),
            (books: Array<IBook>, err: any) => {
              if (err) {
                handleError(res, err);
              }
              res.status(200).json(books);
            }
          );
        }
      }
    );
  };
}

function updateAuthorInfo(author: IAuthor, reqAuthor: IAuthor) {
  author.name = reqAuthor.name;
  author.age = reqAuthor.age;
  author.birthday = reqAuthor.birthday;
  author.country = reqAuthor.country;
  author.bio = reqAuthor.bio;
}
