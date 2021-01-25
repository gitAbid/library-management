import express from 'express'
import {getBooks, getBooksById, addBook, updateBook, deleteBook, patchBook} from '../contollers/book_controller'

const bookRouter = express.Router();

bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBooksById);
bookRouter.post('/', addBook);
bookRouter.patch('/:id', patchBook);
bookRouter.put('/:id', updateBook);
bookRouter.delete('/:id', deleteBook);


export {
    bookRouter
}