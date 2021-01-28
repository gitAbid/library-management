import express from "express";
import UserController from "../contoller/user_controller";
import {authenticateRole, authenticateToken} from "../middleware/auth";
import {UserRole} from "../interface/user";
import {upload} from "../middleware/upload";

const userRouter = express.Router();
const userController = new UserController();


userRouter.get("/", authenticateToken, authenticateRole([UserRole[UserRole.ADMIN]]),
    userController.getAllUsers);

userRouter.post("/authenticate", userController.authenticate);

userRouter.post("/register", userController.register);

userRouter.get("/profile", authenticateToken, authenticateRole([UserRole[UserRole.MEMBER],
    UserRole[UserRole.ADMIN]]), userController.getUserProfileDetails);

userRouter.post("/profile/upload", upload.single('file'),
    authenticateToken, authenticateRole([UserRole[UserRole.MEMBER], UserRole[UserRole.ADMIN]]),
    userController.uploadProfilePicture);

export {userRouter};
