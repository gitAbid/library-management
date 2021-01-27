import { Request, Response } from "express";
import IUser from "../interfaces/user";
import User from "../models/user";
import UserRepositroy from "../repositorty/user_repo";
import { handleError, handleSuccess, handleFailed } from "../utils/util";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const userRepository = new UserRepositroy();

export default class UserController {
  register = (req: Request, res: Response) => {
    const user = new User(req.body);
    userRepository.update(user, (user: IUser, err: any) => {
      if (err) {
        handleError(res, err);
      } else if (user) {
        handleSuccess(res, "User succesfully created", {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
        });
      } else {
        handleError(
          res,
          new Error("Something went wrong, please try again later")
        );
      }
    });
  };

  authenticate = (req: Request, res: Response) => {
    const { username, password } = req.body;

    userRepository.findByUsernameAndPassword(
      username,
      password,
      (user: IUser, err: any) => {
        if (err) {
          handleError(res, err);
        } else if (user) {
          const expiration =
            new Date().getMilliseconds() + config.tokenConfig.expiration;
          const token = jwt.sign(
            {
              username: user.name,
              role: user.role,
              expiration: expiration,
            },
            config.tokenConfig.secret
          );
          handleSuccess(res, "Auhtnetication Success", {
            token: token,
            expiration: expiration,
          });
        } else {
          handleFailed(res, "Invalid credentails");
        }
      }
    );
  };

  uploadProfilePicture = (req: Request, res: Response) => {};
}
