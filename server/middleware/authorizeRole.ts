import { Request, Response, NextFunction } from "express";

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};
