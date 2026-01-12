import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!, // ✅ SAME SECRET AS MIDDLEWARE
    { expiresIn: "1h" }
  );
};
