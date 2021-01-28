import {Request, Response} from "express";
import IUser from "../interface/user";
import User from "../model/user";
import UserRepository from "../repository/user_repo";
import {
    checkPassword,
    getEncryptedPassword,
    getUsername,
    handleError,
    handleFailed,
    handleSuccess
} from "../util/utils";
import {generateJWT} from "../middleware/auth";

const userRepository = new UserRepository();

export default class UserController {
    register = (req: Request, res: Response) => {
        let user = new User(req.body);
        getEncryptedPassword(res, user.password, (encryptedPassword: string, err: any) => {
            if (err) {
                handleError(res, err);
            } else {
                user.password = encryptedPassword
                userRepository.save(user, (user: IUser, err: any) => {
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
            }
        })

    };

    authenticate = (req: Request, res: Response) => {
        const {username, password} = req.body;
        userRepository.findByUsername(
            username,
            (user: IUser, err: any) => {
                if (err) {
                    handleError(res, err);
                } else if (user) {
                    checkPassword(password, user.password, (isSame: boolean, err: any) => {
                        if (err) {
                            handleError(res, err)
                        } else if (isSame) {
                            generateJWT(user, (token: string, err: any) => {
                                if (err) {
                                    handleError(res, err)
                                }
                                handleSuccess(res, "Authentication Success", {
                                    token: token,
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        username: user.username,
                                        role: user.role,
                                    }
                                });
                            })
                        } else {
                            handleFailed(res, "Invalid credentials");
                        }
                    })
                } else {
                    handleFailed(res, "Invalid credentials");
                }
            }
        );
    }

    uploadProfilePicture = (req: Request, res: Response) => {
        const {filename} = req.file
        const username = getUsername(res);
        console.log(req.file)

        if (filename) {
            userRepository.findByUsername(username, (user: IUser, err: any) => {
                if (err) {
                    handleError(res, err)
                } else if (user) {
                    user.profileImage = req.file.filename;
                    userRepository.findByIdAndUpdate(user._id, user, ((user: IUser, err: any) => {
                        if (err) {
                            handleError(res, err)
                        } else if (user) {
                            handleSuccess(res, "Profile image uploaded successfully", {
                                _id: user._id,
                                name: user.name,
                                username: user.username,
                                role: user.role,
                                profileImage: user.profileImage
                            })
                        } else {
                            handleFailed(res, `No user found`)
                        }

                    }));
                } else {
                    handleFailed(res, `No user found`)
                }
            })
        } else {
            handleError(res, new Error("Some went wrong while uploading images. Please try again"))
        }
    };

    getUserProfileDetails = (req: Request, res: Response) => {
        const username = getUsername(res)
        userRepository.findByUsername(username, (user: IUser, err: any) => {
            if (err) {
                handleError(res, err)
            } else if (user) {
                handleSuccess(res, "", {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    role: user.role,
                    profileImage: user.profileImage == null ? '' : user.profileImage
                })
            } else {
                handleFailed(res, `No user found`)
            }

        })
    }

    getAllUsers = (req: Request, res: Response) => {
        userRepository.findAllUser((users: Array<IUser>, err: any) => {
                if (err) {
                    handleError(res, err)
                } else {
                    handleSuccess(res, "", convertToBasiUsers(users))
                }
            }
        )
    }
}

function convertToBasiUsers(users: Array<IUser>) {
    return users.map(user => ({
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage == null ? '' : user.profileImage
    }))
}
