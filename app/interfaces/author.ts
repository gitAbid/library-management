import {Document} from 'mongoose'

export default interface IAuthor extends Document {
    title: string,
    isLoaned: boolean
}