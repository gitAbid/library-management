import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {config} from "../config/config";
import {handleResponseMessage} from "../utils/util";
import IUser from "../interfaces/user";


export const authenticate = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        jwt.verify(token, config.tokenConfig.secret, (err: any, user: any) => {
            if (err) {
                return handleResponseMessage(res, 403, "Forbidden", "Token is not valid")
            } else {
                res.locals.user = user
                next()
            }
        });
    } else {
        return handleResponseMessage(res, 401, "Unauthorized", "No authorization found");
    }
};


export const generateJWT = (user: IUser, callback: Function) => {
    const expiration = Date.now() + config.tokenConfig.expiration

    jwt.sign(
        {
            username: user.username,
            role: user.role,
        },
        config.tokenConfig.secret,
        {
            issuer: config.tokenConfig.issuer,
            algorithm: "HS256",
            expiresIn: expiration
        }, (error: any, token: string) => {
            callback(token, error)
        }
    );
}

export const authenticateRole = (allowedRoles: Array<String>) => {
    return (req: Request, res: Response, next: any) => {
        const role = res.locals.user.role
        console.log(role)
        if (role && allowedRoles.includes(role)) {
            next()
        } else {
            handleResponseMessage(res, 403, "Access Denied", "User don't have permission to access this resource")
        }
    }

}