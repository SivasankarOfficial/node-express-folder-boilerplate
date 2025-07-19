import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"

  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    (req as any).user = decoded;
    next(); // Token is valid, proceed
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
