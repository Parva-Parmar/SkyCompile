import {Router} from "express";
import { signupController } from "../controllers/auth.controller";
import { singupValidator } from "../middleware/signup.middleware";

const router = Router();

router.post("/signup", singupValidator,signupController);

export default router;