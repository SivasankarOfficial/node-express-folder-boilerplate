import express from "express";
import { acceptProposal, createProposal, getProposalsByJob } from "../controllers/proposal.controller";
import { authMiddleware, requireRole } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createProposal);
router.get("/job/:jobId", authMiddleware, requireRole("CLIENT"), getProposalsByJob);
router.put("/proposals/:proposalId/accept", authMiddleware, requireRole("CLIENT"), acceptProposal);

export default router;
