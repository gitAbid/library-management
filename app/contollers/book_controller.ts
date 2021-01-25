import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/book";

export const allBooks = (req: Request, res: Response) => {
  Book.find()
    .exec()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const getBookById = (req: Request, res: Response) => {
  let { id } = req.params;
  Book.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const addBook = (req: Request, res: Response) => {
  let { title, author } = req.body;

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title,
    author,
  });
  console.log(req.body);
  return book
    .save()
    .then((result) => {
      res.status(201).json({
        book: result,
      });
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const updateBook = (req: Request, res: Response) => {
  let { id } = req.params;
  let { title, author } = req.body;

  Book.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        result.author = author;
        result.title = title;

        result
          .save()
          .then((updateBook) => {
            return res.status(200).json(result);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: error.message,
              error: error,
            });
          });
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const deleteBook = (req: Request, res: Response) => {
  let { id } = req.params;
  Book.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        result
          .delete()
          .then((deletedResult) => {
            res.status(200).json({
              message: `Book deleted with id ${id}`,
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: error.message,
              error: error,
            });
          });
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};

export const patchBook = (req: Request, res: Response) => {
  let { id } = req.params;
  let { title, author } = req.body;

  Book.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        if (title) {
          result.title = title;
        }
        if (author) {
          result.author = author;
        }

        result
          .save()
          .then((updateBook) => {
            return res.status(200).json(result);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: error.message,
              error: error,
            });
          });
      } else {
        return res.status(404).json({
          message: `No book found with id ${id}`,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
};
