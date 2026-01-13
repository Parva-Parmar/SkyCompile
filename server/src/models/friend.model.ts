// server/src/models/friend.model.ts
import { pool } from "./db";

/**
 * Send friend request (by user IDs)
 */
export const createFriendRequest = async (
  requesterId: string,
  addresseeId: string
) => {
  const result = await pool.query(
    `
    INSERT INTO friendships (requester_id, addressee_id, status)
    VALUES ($1, $2, 'pending')
    RETURNING *
    `,
    [requesterId, addresseeId]
  );

  return result.rows[0];
};

/**
 * Get incoming friend requests
 */
export const getIncomingRequests = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      f.id,
      u.firstname,
      u.lastname,
      u.email,
      f.created_at
    FROM friendships f
    JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = $1
      AND f.status = 'pending'
    ORDER BY f.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

/**
 * Accept friend request
 */
export const acceptFriendRequest = async (
  requestId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    UPDATE friendships
    SET status = 'accepted'
    WHERE id = $1
      AND addressee_id = $2
      AND status = 'pending'
    RETURNING *
    `,
    [requestId, userId]
  );

  return result.rows[0];
};

/**
 * Reject / cancel friend request
 */
export const deleteFriendRequest = async (
  requestId: string,
  userId: string
) => {
  await pool.query(
    `
    DELETE FROM friendships
    WHERE id = $1
      AND addressee_id = $2
    `,
    [requestId, userId]
  );
};

/**
 * Get accepted friends list
 */
export const getFriends = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.firstname,
      u.lastname,
      u.email
    FROM friendships f
    JOIN users u
      ON (
        u.id = f.requester_id AND f.addressee_id = $1
      )
      OR (
        u.id = f.addressee_id AND f.requester_id = $1
      )
    WHERE f.status = 'accepted'
    `,
    [userId]
  );

  return result.rows;
};

/**
 * Remove friend (both directions handled)
 */
export const removeFriend = async (userId: string, friendId: string) => {
  await pool.query(
    `
    DELETE FROM friendships
    WHERE status = 'accepted'
      AND (
        (requester_id = $1 AND addressee_id = $2)
        OR
        (requester_id = $2 AND addressee_id = $1)
      )
    `,
    [userId, friendId]
  );
};
