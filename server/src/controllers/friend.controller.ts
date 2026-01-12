import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  fetchFriends,
  createFriendship,
  deleteFriendship,
} from "../services/friend.service";

export const listFriends = async (req: AuthRequest, res: Response) => {
  res.json(await fetchFriends(req.userId!));
};

export const addFriend = async (req: AuthRequest, res: Response) => {
  await createFriendship(req.userId!, req.params.friendId);
  res.status(201).json({ message: "Friend added" });
};

export const removeFriend = async (req: AuthRequest, res: Response) => {
  await deleteFriendship(req.userId!, req.params.friendId);
  res.json({ message: "Friend removed" });
};
