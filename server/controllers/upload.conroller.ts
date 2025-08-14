// controllers/uploadController.ts
import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { profileImage: imageUrl },
      create: {
        userId,
        profileImage: imageUrl,
      },
    });

    return res.status(200).json({ message: "Image uploaded", imageUrl, profile });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
