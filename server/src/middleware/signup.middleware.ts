import {Request, Response, NextFunction} from "express";

export const singupValidator = (req: Request, res: Response, next: NextFunction) => {
    const { firstname,lastname, email , password, confirmPassowrd } = req.body;

    if(!firstname || ! lastname || !email || !password || !confirmPassowrd){
        return res.status(400).json({message: "All fiends are required"});
    }

    if( password !== confirmPassowrd){
        return res.status(400).json({message: "password and confirmpassword do not match"});
    }

    next();
};