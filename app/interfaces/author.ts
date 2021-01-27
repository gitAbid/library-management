import {Document} from 'mongoose'

export default interface IAuthor extends Document {
    name: string,
    birthday:string,
    age:string,
    country:string,
    bio:string
}