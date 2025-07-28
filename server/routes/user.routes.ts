import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getUserInfo } from "../controllers/user.controller";
import { getAllUsers } from "../controllers/admin.controller";
const router = Router();

// GET /api/user/me
router.get("/users", getAllUsers);

router.get("/me", authMiddleware, getUserInfo);

export default router;
