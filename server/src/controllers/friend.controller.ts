import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  sendFriendRequest,
  fetchIncomingRequests,
  approveFriendRequest,
  rejectFriendRequest,
  fetchFriends,
  unfriend,
} from "../services/friend.service";

/**
 * POST /friends/request
 * Add friend by email
 */
export const requestFriend = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const request = await sendFriendRequest(req.user.id, email);
    res.status(201).json(request);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET /friends/requests
 * Incoming friend requests
 */
export const getFriendRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requests = await fetchIncomingRequests(req.user.id);
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Failed to load friend requests" });
  }
};

/**
 * POST /friends/accept/:id
 */
export const acceptFriend = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requestId = req.params.id;
    const result = await approveFriendRequest(requestId, req.user.id);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE /friends/reject/:id
 */
export const rejectFriend = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await rejectFriendRequest(req.params.id, req.user.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to reject friend request" });
  }
};

/**
 * GET /friends
 * List accepted friends
 */
export const listFriends = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const friends = await fetchFriends(req.user.id);
    res.json(friends);
  } catch {
    res.status(500).json({ message: "Failed to load friends" });
  }
};

/**
 * DELETE /friends/:id
 * Remove friend
 */
export const removeFriendController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await unfriend(req.user.id, req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to remove friend" });
  }
};
