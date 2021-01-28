import mongoose from "mongoose";
import {config} from "../config/config";
import GridFSStorage from "multer-gridfs-storage";
import crypto from "crypto"
import path from "path"
import g from "gridfs-stream";

const mongooseConnection = mongoose
    .connect(config.mongo.url, config.mongo.options);
mongooseConnection
    .then((result) => {
        console.log("Mongo Connected Success");
    })
    .catch((error) => {
        console.log("Error occurred", error);
    });

export const storage = new GridFSStorage({
    db: mongooseConnection, file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

export const gfs = g(mongooseConnection, mongoose.mongo)


