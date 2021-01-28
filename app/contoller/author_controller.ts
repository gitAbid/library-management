import {Request, Response} from "express";
import Author from "../model/author";
import BookAuthorRepository from "../repository/book_author_repo";
import AuthorRepository from "../repository/author_repo";
import {handleError, handleFailed, handleSuccess, handleSuccessWithStatus} from "../util/utils";
import IAuthor from "../interface/author";
import IBook from "../interface/book";
import BookRepository from "../repository/book_repo";
import IBookAuthor from "../interface/book_author";
import mongoose from "mongoose";

const authorRepo = new AuthorRepository();
const bookAuthorRepo = new BookAuthorRepository();
const bookRepo = new BookRepository();

export default class AuthorController {
    allAuthors = (req: Request, res: Response) => {
        authorRepo.findAllBook((authors: Array<IAuthor>, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, "", authors)
            }
        });
    };

    addAuthor = (req: Request, res: Response) => {
        const author = new Author(req.body);
        authorRepo.save(author, (updatedAuthor: IAuthor, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccessWithStatus(res, 201, "Author created successfully", author)
            }
        });
    };

    getAuthorById = (req: Request, res: Response) => {
        let {id} = req.params;
        authorRepo.findById(id, (author: IAuthor, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, "", author)
            }
        });
    };

    updateAuthor = (req: Request, res: Response) => {
        let {id} = req.params;
        let reqAuthor = new Author(req.body);

        authorRepo.findById(id, (author: IAuthor, err: any) => {
            if (err) {
                handleError(res, err);
            } else if (author) {
                updateAuthorInfo(author, reqAuthor);
                authorRepo.save(author, (updatedAuthor: IAuthor, err: any) => {
                    if (err) {
                        handleError(res, err);
                    } else {
                        handleSuccess(res, "Author updated successfully", updatedAuthor)
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
        let {id} = req.params;

        authorRepo.deleteById(id, (result: any, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                handleSuccess(res, `Author deleted with id ${id}`, {})
            }
        });
    };

    patchAuthor = (req: Request, res: Response) => {
        let {id} = req.params;
        const author = new Author(req.body);
        author._id = id;
        authorRepo.findByIdAndUpdate(id, author, (updateBook: IBook, err: any) => {
            if (err) {
                handleError(res, err);
            } else if (author) {
                handleSuccess(res, "Author updated successfully", author)
            } else {
                handleFailed(res, `No book found with id ${id}`)
            }
        });
    };

    getAuthorBooks = (req: Request, res: Response) => {
        const {authorId} = req.params;
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
                            } else {
                                handleSuccess(res, "", books)
                            }
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
