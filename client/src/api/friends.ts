import {
  getAuthRequest,
  postAuthRequest,
  deleteAuthRequest,
} from "./http";

/* =========================
   Types
========================= */

export interface Friend {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface FriendRequest {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
}

/* =========================
   API calls
========================= */

/**
 * Send friend request by email
 * POST /api/v1/friends/request
 */
export const sendFriendRequest = async (email: string) => {
  return postAuthRequest("/friends/request", { email });
};

/**
 * Get incoming friend requests
 * GET /api/v1/friends/requests
 */
export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  return getAuthRequest("/friends/requests");
};

/**
 * Accept friend request
 * POST /api/v1/friends/accept/:id
 */
export const acceptFriendRequest = async (requestId: string) => {
  return postAuthRequest(`/friends/accept/${requestId}`, {});
};

/**
 * Reject friend request
 * DELETE /api/v1/friends/reject/:id
 */
export const rejectFriendRequest = async (requestId: string) => {
  return deleteAuthRequest(`/friends/reject/${requestId}`);
};

/**
 * List friends
 * GET /api/v1/friends
 */
export const getFriends = async (): Promise<Friend[]> => {
  return getAuthRequest("/friends");
};

/**
 * Remove friend
 * DELETE /api/v1/friends/:id
 */
export const removeFriend = async (friendId: string) => {
  return deleteAuthRequest(`/friends/${friendId}`);
};
