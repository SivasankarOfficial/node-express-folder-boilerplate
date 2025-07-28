import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can create jobs." });
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        jobs: true,
        proposals: true,
      },
    });
    const filteredUsers = users.map((u) => {
      if (u.role === "FREELANCER") {
        const { jobs, ...rest } = u;
        return rest; // return user without `jobs`
      }
      return u; // return full user (with jobs)
    });
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
