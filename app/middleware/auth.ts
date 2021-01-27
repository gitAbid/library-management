import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import IUser from "../interfaces/user";

export const authenticate = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, config.tokenConfig.secret, (err: any, user: IUser) => {
      if (err) return res.sendStatus(403)
      next()
    });
  } else {
    return res.sendStatus(401);
  }
};
