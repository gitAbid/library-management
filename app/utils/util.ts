import { Response } from "express";

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
