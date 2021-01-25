import {Document} from 'mongoose'


export default interface IBookLoan extends Document {
    bookId: string,
    username: string,
    isLoanAccepeted: boolean
}