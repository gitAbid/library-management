import IBookLoan, {LoanState} from "../interface/book_loan";
import BookLoan from "../model/book_loan";

export default class BookLoanRepository {
    findById = (id: string, callback: Function) => {
        BookLoan.findById(id)
            .exec()
            .then((loan) => {
                callback(loan, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };

    findAllBookLoans = (callback: Function) => {
        BookLoan.find()
            .exec()
            .then((loans) => {
                callback(loans, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };

    findNewBookLoanByBookIdAndUsername = (
        bookId: string,
        username: string,
        callback: Function
    ) => {
        BookLoan.findOne({bookId: bookId, username: username, loanState: LoanState[LoanState.NEW]})
            .exec()
            .then((loan) => {
                callback(loan, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };

    save = (book: IBookLoan, callback: Function) => {
        book.save()
            .then((savedBookLoan) => {
                callback(savedBookLoan, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };
}
