import BookAuthor from "../model/book_author";
import IBookAuthor from "../interface/book_author";

export default class BookAuthorRepository {
    findByBookId = (id: string, callback: Function) => {
        BookAuthor.find({bookId: id})
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
        BookAuthor.find({authorId: id})
            .exec()
            .then((result) => {
                callback(result, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };

    save = (bookAuthor: IBookAuthor, callback: Function) => {
        bookAuthor.save()
            .then((result) => {
                callback(result, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };

    deleteByBookId = (bookId: string, callback: Function) => {
        BookAuthor.deleteMany({bookId: bookId})
            .then((result) => {
                callback(result, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };
}
