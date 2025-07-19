import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models";

const User = db.User;
console.log("Registering user:");

export const register = async (req: Request, res: Response) => {
  try {
    console.log("Registering user:", req.body);
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    console.error("Error during registration", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.getDataValue("password"));
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user.getDataValue("id"), role: user.getDataValue("role") },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "1d",
    }
  );

  res.json({ token }); // Send token to frontend
};
