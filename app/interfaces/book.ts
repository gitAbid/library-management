import {Document} from 'mongoose'


export default interface IBook extends Document {
    title: string,
    authors:Array<string>
    isLoaned: boolean
}