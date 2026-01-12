import {
  getFriendsByUser,
  insertFriendship,
  deleteFriendshipByUser,
} from "../models/friend.model";

export const fetchFriends = (userId: string) =>
  getFriendsByUser(userId);

export const createFriendship = (userId: string, friendId: string) =>
  insertFriendship(userId, friendId);

export const deleteFriendship = (userId: string, friendId: string) =>
  deleteFriendshipByUser(userId, friendId);
