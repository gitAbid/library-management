import mongoose,{Document} from 'mongoose'
import IAuthor from './author';
import IBook from './book';

export default interface IBookAuthor extends Document {
    authorId:string
    bookId:string
}
