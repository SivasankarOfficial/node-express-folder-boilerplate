import express from "express";
import { createJob, getAllJobs, getJobById, deleteJob, updateJobStatus } from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", getAllJobs);
router.get("/:jobId", getJobById);
router.put("/status/:jobId", authMiddleware, updateJobStatus);
router.delete("/:id", authMiddleware, deleteJob);

export default router;
