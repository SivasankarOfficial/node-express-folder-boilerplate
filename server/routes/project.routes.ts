// routes/project.routes.ts

import express from "express";
import {
  createProject,
  getProjectsByFreelancer,
  getProjectsByClient,
  updateProjectStatus,
} from "../controllers/project.controller";
import { authMiddleware, requireRole } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/projects", authMiddleware, createProject);
router.get("/projects/freelancer/:freelancerId", authMiddleware, getProjectsByFreelancer);
router.get("/projects/client/:clientId", authMiddleware, getProjectsByClient);
router.put("/projects/:projectId", authMiddleware, requireRole("CLIENT"), updateProjectStatus);

export default router;
