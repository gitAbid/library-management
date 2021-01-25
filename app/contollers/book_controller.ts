import {Request, Response} from 'express'
import Book from "../models/book";
import IBook from "../interfaces/book";
import mongoose from "mongoose";

export const getBooks = (req: Request, res: Response) => {
    Book.find()
        .exec()
        .then((result: IBook) => {
            return res.status(200).json(result)
        }).catch((error: any) => {
        console.log(error)
    })
}

export const getBooksById = (req: Request, res: Response) => {
    let {id} = req.params
    Book.findById(id)
        .exec()
        .then((result: IBook) => {
            if (result) {
                return res.status(200).json(result)
            } else {
                return res.status(404).json({
                    message: `No book found with id ${id}`
                })
            }
        }).catch((error: any) => {
        console.log(error)
        res.status(500).json({
            message: error.message,
            error: error
        })
    })
}

export const addBook = (req: Request, res: Response) => {
    let {title, author} = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title,
        author
    });
    console.log(req.body)
    return book.save()
        .then((result) => {
            res.status(201).json({
                book: result
            })
        })
        .catch((error: any) => {
            console.log(error)
            res.status(500).json({
                message: error.message,
                error: error
            })
        })
}

export const updateBook = (req: Request, res: Response) => {
    res.send("Hello From updateBook Book")
}

export const deleteBook = (req: Request, res: Response) => {
    res.send("Hello From deleteBook Book")
}

export const patchBook = (req: Request, res: Response) => {
    res.send("Hello From patchBook Book")
}

