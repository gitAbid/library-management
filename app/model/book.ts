import mongoose, {Schema} from "mongoose";
import IBook from "../interface/book";
import {foreignKeyValidator} from "../util/utils";

const BookSchema: Schema = new Schema<any>(
    {
        title: {type: String, required: true, index: true},
        isbn: {type: String, required: true},
        category: {type: String, required: true, index: true},
        description: {type: String, required: true},
        authors: [
            {
                type: String,
                required: true,
                validate: {
                    validator: (id: string) => {
                        return foreignKeyValidator(mongoose.model("Author"), id);
                    },
                },
            },
        ],
        inventoryCount: {
            type: Number,
            required: true,
        },
        loanCount: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

BookSchema.index({title: 1, isbn: 1}, {unique: true});

BookSchema.post("remove", function (book) {
    mongoose
        .model("BookAuthor")
        .deleteMany({bookId: book._id})
        .exec()
        .then(() => {
            console.log(
                `Clealer relation for book author for bookId ${book._id}`
            );
        })
        .catch((err) => {
            console.error(
                `Error occurred while cleaning up author book relation for removed authorId ${book._id}`,
                err
            );
        });
});
export default mongoose.model<IBook>("Book", BookSchema);
