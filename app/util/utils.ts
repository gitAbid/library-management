import {Response} from "express";
import mongoose from "mongoose";
import IAuthor from "../interface/author";
import IUser from "../interface/user";
import bcrypt from "bcryptjs";

export const handleSuccess = (
    res: Response<any, Record<string, any>>,
    message: string,
    data: any
) => {
    res.status(200).json({
        status: "SUCCESS",
        message: message,
        data: data,
    });
};

export const handleSuccessWithStatus = (
    res: Response<any, Record<string, any>>,
    status: number,
    message: string,
    data: any
) => {
    res.status(status).json({
        status: "SUCCESS",
        message: message,
        data: data,
    });
};


export const handleFailed = (
    res: Response<any, Record<string, any>>,
    message: string
) => {
    res.status(400).json({
        status: "FAILED",
        message: message,
        data: null,
    });
};

export const handleError = (
    res: Response<any, Record<string, any>>,
    err: any
) => {
    res.status(500).json({
        message: err.message,
        error: err,
        data: null,
    });
};

export const handleResponseMessage = (
    res: Response<any, Record<string, any>>,
    status: number,
    message: string,
    err: any
) => {
    res.status(status).json({
        message: message,
        error: err,
    });
};

export const foreignKeyValidator = (
    model: mongoose.Model<IAuthor>,
    id: string
) => {
    return new Promise((resolve, reject) => {
        model.findOne({_id: id}, (err: any, result: IAuthor) => {
            if (result) {
                return resolve(true);
            } else
                return reject(
                    new Error(
                        `FK Constraint 'checkObjectsExists' for '${id.toString()}' failed`
                    )
                );
        });
    });
};

export const usernameValidator = (model: mongoose.Model<IUser>, username: string) => {
    return new Promise((resolve, reject) => {
        model.findOne({username: username}, (err: any, result: IAuthor) => {
            if (result) {
                return reject(
                    new Error(
                        `Unique USERNAME Constraint 'checkObjectsExists' for '${username.toString()}' failed`
                    )
                );
            } else {
                return resolve(true);
            }
        });
    });
};
export const getUsername = (res: Response) => {
    let username = res.locals.user.username;
    if (username == null) {
        handleResponseMessage(res, 404, "Unauthorized", "Credentials not valid")
    } else {
        return username;
    }
}
export const getEncryptedPassword = (res: Response, password: string, callback: Function) => {
    bcrypt.hash(password, 10, (err: any, hash: string) => {
        callback(hash, err)
    })
}
export const checkPassword = (providedPassword: string, userPassword: string, callback: Function) => {
    bcrypt.compare(providedPassword, userPassword, (err, res) => {
        callback(res, err)
    })
}