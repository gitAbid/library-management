import express from "express";
import UserController from "../contollers/user_controller";
import {authenticate, authenticateRole} from "../middleware/auth";
import {UserRole} from "../interfaces/user";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/authenticate", userController.authenticate);

userRouter.post("/register", userController.register);

userRouter.post("/:userId/profile/upload", authenticate, authenticateRole([UserRole[UserRole.MEMBER],
    UserRole[UserRole.ADMIN]]), userController.uploadProfilePicture);

export {userRouter};
