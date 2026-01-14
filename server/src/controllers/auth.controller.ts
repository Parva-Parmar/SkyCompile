import {Request, Response} from "express";
import { signupService } from "../services/auth.service";
import { signinService } from "../services/auth.service";

export const signupController = async (req: Request, res: Response) => {
    try {
        await signupService(req.body);
        res.status(201).json({message: "User created successfully"});
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const signinController = async (req: Request, res: Response) => {
    try{
        const { token, user } = await signinService(req.body);
        // console.log("Generated Token:", token);
        res.status(200).json({
            token,
            user,
        });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}