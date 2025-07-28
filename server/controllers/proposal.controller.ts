import { Request, Response } from "express";
import { PrismaClient, ProposalStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// ✅ Submit a proposal (FREELANCER only)
export const createProposal = async (req: AuthRequest, res: Response) => {
  try {
    const { content, jobId, proposedBudget, status } = req.body;
    const userId = req.user?.id;

    if (req.user?.role !== "FREELANCER") {
      return res.status(403).json({ message: "Only FREELANCER can create proposal." });
    }

    if (!userId || !content || !jobId || !proposedBudget) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const proposal = await prisma.proposal.create({
      data: {
        content,
        jobId,
        userId,
        proposedBudget,
        status: status ?? ProposalStatus.SUBMITTED, // fallback to default
      },
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create proposal", error });
  }
};

// ✅ Get all proposals for a specific job
export const getProposalsByJob = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params;

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required." });
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  // Ensure the client owns the job
  if (!job || job.userId !== req.user?.id) {
    return res.status(403).json({ message: "You are not authorized to view proposals for this job." });
  }

  try {
    const proposals = await prisma.proposal.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch proposals", error });
  }
};

export const acceptProposal = async (req: AuthRequest, res: Response) => {
  const proposalId = req.params.proposalId;

  if (req.user?.role !== "CLIENT") {
    return res.status(403).json({ message: "Only CLIENT can accept proposals." });
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true },
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found." });
    }

    // Ensure the current client owns the job
    if (proposal.job.userId !== req.user?.id) {
      return res.status(403).json({ message: "You are not authorized to accept this proposal." });
    }

    // Update the proposal status to ACCEPTED
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: ProposalStatus.ACCEPTED },
    });

    res.status(200).json({ message: "Proposal accepted.", proposal: updatedProposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept proposal", error });
  }
};
