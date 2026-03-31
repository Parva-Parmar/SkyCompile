// Database-aligned TypeScript types
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string | null;
  project_count: number;
  friend_count: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

// Helper function to get full name (frontend responsibility)
export const getFullName = (user: User): string => {
  return `${user.firstname} ${user.lastname}`.trim();
};

// Database table interfaces for reference
export interface UserTable {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  created_at: string;
}

export interface ProjectTable {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface FriendshipTable {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

export interface ProjectMemberTable {
  id: string;
  project_id: string;
  user_id: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}
