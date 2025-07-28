// src/middleware/auth.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // replace with env in real app

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    (req as AuthRequest).user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Optional: Role check middleware
export const requireRole = (role: "CLIENT" | "FREELANCER" | "ADMIN") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1]; //"Bearer token"
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (req as any).userId = (decoded as any).id;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };
