import { pool } from "./db";

export const getFriendsByUser = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT u.id, u.firstname, u.lastname, u.email
    FROM friendships f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id = $1
    `,
    [userId]
  );
  return result.rows;
};

export const insertFriendship = async (
  userId: string,
  friendId: string
) => {
  await pool.query(
    "INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2)",
    [userId, friendId]
  );
};

export const deleteFriendshipByUser = async (
  userId: string,
  friendId: string
) => {
  await pool.query(
    "DELETE FROM friendships WHERE user_id = $1 AND friend_id = $2",
    [userId, friendId]
  );
};
