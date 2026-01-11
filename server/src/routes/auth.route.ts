import {Router} from "express";
import { signupController , signinController} from "../controllers/auth.controller";
import { signupValidator } from "../middleware/signup.middleware";
import { signinValidator } from "../middleware/signin.middleware";

const router = Router();

router.post("/signup", signupValidator, signupController);
router.post("/signin", signinValidator, signinController);


export default router;