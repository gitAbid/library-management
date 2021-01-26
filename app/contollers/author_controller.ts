import { Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/author";
import BookRepositroy from "../repositorty/book_repo";
import AuthorRepsoitory from "../repositorty/author_repo";
import { handleError, handleFailed, handleSuccess } from "../utils/util";
import IAuthor from "../interfaces/author";
import IBook from "../interfaces/book";

const bookRepo = new BookRepositroy();
const authorRepo = new AuthorRepsoitory();

export const allAuthors = (req: Request, res: Response) => {
  authorRepo.findAllBook((books: Array<IAuthor>, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      res.status(200).json(books);
    }
  });
};

export const addAuthor = (req: Request, res: Response) => {
  let { name, books } = req.body;

  let booksIds: Array<Object> = books;
  let ids: Array<mongoose.Types.ObjectId> = [];
  if (booksIds) {
    ids = booksIds.map((id) => mongoose.Types.ObjectId(String(id)));
  }

  console.log(books);

  bookRepo.findAuthorByIds(ids, (books: Array<IBook>, err: any) => {
    const author = new Author({
      _id: new mongoose.Types.ObjectId(),
      name:name,
      books,
    });

    authorRepo.update(author, (updatedAuthor: IAuthor, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        res.status(201).json(updatedAuthor);
      }
    });
  });
};

