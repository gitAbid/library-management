import {Document} from 'mongoose'


export default interface IBook extends Document {
    title: string,
    isbn:string,
    category:string,
    description:string,
    inventoryCount:number,
    loanCount:number,
    authors:Array<string>
}