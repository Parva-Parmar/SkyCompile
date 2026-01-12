import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  listFriends,
  addFriend,
  removeFriend,
} from "../controllers/friend.controller";

const router = Router();

router.get("/", authMiddleware, listFriends);
router.post("/:friendId", authMiddleware, addFriend);
router.delete("/:friendId", authMiddleware, removeFriend);

export default router;
