import { Response } from "express";
import monmongoose from "mongoose";
import IAuthor from "../interfaces/author";

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

export const forignKeyValidator = (model: monmongoose.Model<IAuthor>, id: string) => {
  return new Promise((resolve, reject) => {
    model.findOne({ _id: id }, (err: any, result: IAuthor) => {
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
