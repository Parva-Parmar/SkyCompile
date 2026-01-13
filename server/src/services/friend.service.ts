import {
  createFriendRequest,
  getIncomingRequests,
  acceptFriendRequest,
  deleteFriendRequest,
  getFriends,
  removeFriend,
} from "../models/friend.model";
import { findUserByEmail } from "../models/user.model";

/**
 * Send friend request by email
 */
export const sendFriendRequest = async (
  requesterId: string,
  email: string
) => {
  // 1️⃣ Find user by email
  const addressee = await findUserByEmail(email);

  if (!addressee) {
    throw new Error("User with this email does not exist");
  }

  // 2️⃣ Prevent self-friend
  if (addressee.id === requesterId) {
    throw new Error("You cannot add yourself as a friend");
  }

  // 3️⃣ Create friend request
  return createFriendRequest(requesterId, addressee.id);
};

/**
 * Get incoming friend requests
 */
export const fetchIncomingRequests = async (userId: string) => {
  return getIncomingRequests(userId);
};

/**
 * Accept friend request
 */
export const approveFriendRequest = async (
  requestId: string,
  userId: string
) => {
  const result = await acceptFriendRequest(requestId, userId);

  if (!result) {
    throw new Error("Friend request not found or already handled");
  }

  return result;
};

/**
 * Reject / delete friend request
 */
export const rejectFriendRequest = async (
  requestId: string,
  userId: string
) => {
  return deleteFriendRequest(requestId, userId);
};

/**
 * List friends
 */
export const fetchFriends = async (userId: string) => {
  return getFriends(userId);
};

/**
 * Remove friend
 */
export const unfriend = async (userId: string, friendId: string) => {
  return removeFriend(userId, friendId);
};
