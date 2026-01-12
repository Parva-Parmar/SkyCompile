import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { fetchMyProfile } from "../services/user.service";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Runtime + TypeScript safety
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const profile = await fetchMyProfile(userId);
    res.json(profile);
  } catch (err) {
    console.error("❌ PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};
