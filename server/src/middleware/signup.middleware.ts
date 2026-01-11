import {Request, Response, NextFunction} from "express";

export const signupValidator = (req: Request, res: Response, next: NextFunction) => {
    console.log("BODY:", req.body);
    const { firstname,lastname, email , password, confirmPassword } = req.body;

    if(!firstname || ! lastname || !email || !password || !confirmPassword){
        return res.status(400).json({message: "All fiends are required"});
    }

    if( password !== confirmPassword){
        return res.status(400).json({message: "password and confirmpassword do not match"});
    }

    next();
};