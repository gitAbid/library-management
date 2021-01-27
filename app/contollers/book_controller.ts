import { Request, Response } from "express";
import mongoose from "mongoose";
import IBook from "../interfaces/book";
import Book from "../models/book";
import BookRepositroy from "../repositorty/book_repo";
import AuthorRepsoitory from "../repositorty/author_repo";
import { handleError, handleFailed, handleSuccess } from "../utils/util";
import IAuthor from "../interfaces/author";
import BookAuthor from "../models/book_author";
import BookAuthorRepositroy from "../repositorty/book_author_repo";
import IBookAuthor from "../interfaces/book_author";

const bookRepo = new BookRepositroy();
const authorRepo = new AuthorRepsoitory();
const bookAuthorRepo = new BookAuthorRepositroy();

export const allBooks = (req: Request, res: Response) => {
  bookRepo.findAllBook((books: Array<IBook>, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      res.status(200).json(books);
    }
  });
};

export const getBookAuthors = (req: Request, res: Response) => {
  const { bookId } = req.params;
  bookAuthorRepo.findByBookId(
    bookId,
    (bookAuthors: Array<IBookAuthor>, err: any) => {
      if (err) {
        handleError(res, err);
      } else {
        authorRepo.findAuthorsByIds(
          bookAuthors?.map((bookAuthor) =>
            mongoose.Types.ObjectId(bookAuthor.authorId)
          ),
          (authors: Array<IAuthor>, err: any) => {
            if (err) {
              handleError(res, err);
            }
            res.status(200).json(authors);
          }
        );
      }
    }
  );
};

export const getBookById = (req: Request, res: Response) => {
  let { id } = req.params;
  bookRepo.findById(id, (book: IBook, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      res.status(200).json(book);
    }
  });
};

export const addBook = (req: Request, res: Response) => {
  const book = new Book(req.body);

  bookRepo.update(book, (updatedBook: IBook, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      updateAuthorBookRelation(book, res);
      res.status(201).json(updatedBook);
    }
  });
};

export const updateBook = (req: Request, res: Response) => {
  let { id } = req.params;
  let reqBook = new Book(req.body);

  bookRepo.findById(id, (book: IBook, err: any) => {
    if (err) {
      handleError(res, err);
    } else if (book) {
      updateBookInfo(book, reqBook);
      bookRepo.update(book, (updateBook: IBook, err: any) => {
        if (err) {
          handleError(res, err);
        } else {
          updateAuthorBookRelation(updateBook, res);
          return res.status(200).json(updateBook);
        }
      });
    } else {
      return res.status(404).json({
        message: `No book found with id ${id}`,
      });
    }
  });
};

export const deleteBook = (req: Request, res: Response) => {
  let { id } = req.params;

  bookRepo.deleteById(id, (result: any, err: any) => {
    if (err) {
      handleError(res, err);
    } else {
      res.status(200).json({
        message: `Book deleted with id ${id}`,
      });
    }
  });
};

export const patchBook = (req: Request, res: Response) => {
  let { id } = req.params;
  const book = new Book(req.body);
  book._id = id;
  bookRepo.findByIdAndUpdate(id, book, (updateBook: IBook, err: any) => {
    if (err) {
      handleError(res, err);
    } else if (book) {
      updateAuthorBookRelation(book, res);
      return res.status(200).json(updateBook);
    } else {
      return res.status(404).json({
        message: `No book found with id ${id}`,
      });
    }
  });
};

function updateBookInfo(book: IBook, reqBook: IBook) {
  book.title = reqBook.title;
  book.authors = reqBook.authors;
  book.isbn = reqBook.isbn;
  book.description = reqBook.description;
  book.category = reqBook.category;
  book.inventoryCount=reqBook.inventoryCount
}

function getIds(authors: any) {
  let authorIds: Array<Object> = authors;

  let ids: Array<mongoose.Types.ObjectId> = [];
  if (authorIds) {
    ids = authorIds.map((id) => mongoose.Types.ObjectId(String(id)));
  }
  return ids;
}

function updateAuthorBookRelation(
  book: IBook,
  res: Response<any, Record<string, any>>
) {
  const ids = getIds(book.authors);
  bookAuthorRepo.deleteByBookId(book._id, (result: any, err: any) => {
    if (err) {
      handleError(res, err);
    }
  });

  authorRepo.findAuthorsByIds(ids, (authors: Array<IAuthor>, err: any) => {
    authors?.forEach((author) => {
      const bookAuthor = new BookAuthor({
        _id: mongoose.Types.ObjectId(),
        authorId: author._id,
        bookId: book._id,
      });

      bookAuthorRepo.update(bookAuthor, (result: IBookAuthor, err: any) => {
        if (err) {
          handleError(res, err);
        }
      });
    });
  });
}
