import {Request, Response} from "express";
import mongoose from "mongoose";
import IBook from "../interfaces/book";
import Book from "../models/book";
import BookRepository from "../repositorty/book_repo";
import AuthorRepository from "../repositorty/author_repo";
import {handleError, handleFailed, handleSuccess, handleSuccessWithStatus} from "../utils/util";
import IAuthor from "../interfaces/author";
import BookAuthor from "../models/book_author";
import BookAuthorRepository from "../repositorty/book_author_repo";
import IBookAuthor from "../interfaces/book_author";

const bookRepo = new BookRepository();
const authorRepo = new AuthorRepository();
const bookAuthorRepo = new BookAuthorRepository();

export default class BookController {
    getAllBooks = (req: Request, res: Response) => {
        bookRepo.findAllBook((books: Array<IBook>, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, "", books)
            }
        });
    };

    getBookAuthors = (req: Request, res: Response) => {
        const {bookId} = req.params;
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
                            handleSuccess(res, "", authors)
                        }
                    );
                }
            }
        );
    };

    getBookById = (req: Request, res: Response) => {
        let {id} = req.params;
        bookRepo.findById(id, (book: IBook, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, "", book)
            }
        });
    };

    addBook = (req: Request, res: Response) => {
        const book = new Book(req.body);

        bookRepo.update(book, (updatedBook: IBook, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                updateAuthorBookRelation(book, res);
                handleSuccessWithStatus(res, 201, "Book created successfully", updatedBook)
            }
        });
    };

    updateBook = (req: Request, res: Response) => {
        let {id} = req.params;
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
                        handleSuccess(res, "Book update successful", updateBook)
                    }
                });
            } else {
                handleFailed(res, `No book found with id ${id}`)
            }
        });
    };

    deleteBook = (req: Request, res: Response) => {
        let {id} = req.params;

        bookRepo.deleteById(id, (result: any, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, `Book deleted with id ${id}`, {})
            }
        });
    };

    patchBook = (req: Request, res: Response) => {
        let {id} = req.params;
        const book = new Book(req.body);
        book._id = id;
        bookRepo.findByIdAndUpdate(id, book, (updateBook: IBook, err: any) => {
            if (err) {
                handleError(res, err);
            } else if (book) {
                updateAuthorBookRelation(book, res);
                handleSuccess(res, "Book update successful", updateBook)
            } else {
                handleFailed(res, `No book found with id ${id}`)
            }
        });
    };
}
const updateBookInfo = (book: IBook, reqBook: IBook) => {
    book.title = reqBook.title;
    book.authors = reqBook.authors;
    book.isbn = reqBook.isbn;
    book.description = reqBook.description;
    book.category = reqBook.category;
    book.inventoryCount = reqBook.inventoryCount
}

const convertToObjectIds = (authors: any) => {
    let authorIds: Array<Object> = authors;

    let ids: Array<mongoose.Types.ObjectId> = [];
    if (authorIds) {
        ids = authorIds.map((id) => mongoose.Types.ObjectId(String(id)));
    }
    return ids;
}

const updateAuthorBookRelation = (
    book: IBook,
    res: Response<any, Record<string, any>>
) => {
    const ids = convertToObjectIds(book.authors);
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

