import { getProfileByUserId } from "../models/user.model";

export const fetchMyProfile = async (userId: string) => {
  return getProfileByUserId(userId);
};
