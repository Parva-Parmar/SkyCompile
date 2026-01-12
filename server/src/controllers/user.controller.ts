import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { fetchMyProfile } from "../services/user.service";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  const profile = await fetchMyProfile(req.userId!);
  res.json(profile);
};
