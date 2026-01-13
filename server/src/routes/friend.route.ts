import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  requestFriend,
  getFriendRequests,
  acceptFriend,
  rejectFriend,
  listFriends,
  removeFriendController,
} from "../controllers/friend.controller";

const router = Router();

/**
 * Send friend request by email
 * POST /api/v1/friends/request
 */
router.post("/request", authMiddleware, requestFriend);

/**
 * Get incoming friend requests
 * GET /api/v1/friends/requests
 */
router.get("/requests", authMiddleware, getFriendRequests);

/**
 * Accept friend request
 * POST /api/v1/friends/accept/:id
 */
router.post("/accept/:id", authMiddleware, acceptFriend);

/**
 * Reject friend request
 * DELETE /api/v1/friends/reject/:id
 */
router.delete("/reject/:id", authMiddleware, rejectFriend);

/**
 * List friends
 * GET /api/v1/friends
 */
router.get("/", authMiddleware, listFriends);

/**
 * Remove friend
 * DELETE /api/v1/friends/:id
 */
router.delete("/:id", authMiddleware, removeFriendController);

export default router;
