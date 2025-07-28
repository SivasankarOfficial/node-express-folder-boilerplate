import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma"; // Make sure this path matches
import { Role } from "@prisma/client"; // make sure it's imported from Prisma, not your own enum

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Validate role
    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles are CLIENT and FREELANCER",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // ✅ Already validated, so no need to cast
      },
    });

    return res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    console.error("Error during registration", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "", { expiresIn: "1d" });

  res.json({ token });
};
