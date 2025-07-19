import { Request, Response } from "express";
import db from "../models";

const User = db.User;

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role"], // exclude password
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
