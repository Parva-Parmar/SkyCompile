import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}


export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("AUTH MIDDLEWARE HIT"); // 👈 ADD THIS

  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader); // 👈 ADD THIS
   
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

   
  const token = authHeader.split(" ")[1];

  try {
    
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string };

   
    req.user = { id: payload.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
