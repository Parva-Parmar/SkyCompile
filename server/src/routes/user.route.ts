import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMyProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);

export default router;
