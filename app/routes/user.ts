import express from "express";
import UserController from "../contollers/user_controller";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/authenticate", userController.authenticate);

userRouter.post("/register", userController.register);

userRouter.post("/:userId/profile/upload", userController.uploadProfilePicture);

export { userRouter };
