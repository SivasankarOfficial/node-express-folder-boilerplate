import express from "express";
import { getMyProfile, createProfile, updateProfile } from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post("/", authMiddleware, createProfile);
router.put("/", authMiddleware, updateProfile);

export default router;
