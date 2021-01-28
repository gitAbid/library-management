import {Request, Response} from "express";
import IUser from "../interface/user";
import User from "../model/user";
import UserRepository from "../repository/user_repo";
import {handleError, handleFailed, handleSuccess} from "../util/utils";
import {generateJWT} from "../middleware/auth";

const userRepository = new UserRepository();

export default class UserController {
    register = (req: Request, res: Response) => {
        const user = new User(req.body);
        userRepository.update(user, (user: IUser, err: any) => {
            if (err) {
                handleError(res, err);
            } else if (user) {
                handleSuccess(res, "User successfully created", {
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
        const {username, password} = req.body;

        userRepository.findByUsernameAndPassword(
            username,
            password,
            (user: IUser, err: any) => {
                if (err) {
                    handleError(res, err);
                } else if (user) {
                    generateJWT(user, (token: string, err: any) => {
                        if (err) {
                            handleError(res, err)
                        }
                        handleSuccess(res, "Authentication Success", {
                            token: token,
                        });
                    })

                } else {
                    handleFailed(res, "Invalid credentials");
                }
            }
        );
    };

    uploadProfilePicture = (req: Request, res: Response) => {
    };
}
