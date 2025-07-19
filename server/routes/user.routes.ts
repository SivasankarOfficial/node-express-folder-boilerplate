import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { getUserInfo } from "../controllers/user.controller";

const router = Router();

// GET /api/user/me
router.get("/me", verifyToken, getUserInfo);

export default router;
