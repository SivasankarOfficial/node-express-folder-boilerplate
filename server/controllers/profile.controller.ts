import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware"; // Make sure AuthRequest adds `user` to `req`

const prisma = new PrismaClient();

// ✅ Get profile by user ID (Authenticated user)
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    console.log("profile", { profile });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err });
  }
};

// ✅ Create profile
export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bio, skills, hourlyRate, availability, profileImage } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user." });
    }

    const profile = await prisma.profile.create({
      data: {
        userId,
        bio,
        skills,
        hourlyRate,
        availability,
        profileImage,
      },
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error creating profile", error: err });
  }
};

// ✅ Update profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bio, skills, hourlyRate, availability, profileImage } = req.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        bio,
        skills,
        hourlyRate,
        availability,
        profileImage,
      },
    });

    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  }
};
