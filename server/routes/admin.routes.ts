import express from "express";
import { authorizeRole } from "../middleware/authorizeRole";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAllUsers } from "../controllers/admin.controller";

const router = express.Router();

// ✅ Only admin can access
router.get("/users", authMiddleware, getAllUsers);

export default router;
