// controllers/project.controller.ts

import { Request, Response } from "express";
import { PrismaClient, JobStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createProject = async (req: Request, res: Response) => {
  try {
    const { jobId, freelancerId } = req.body;
    const user = (req as AuthRequest).user;

    // Ensure user is logged in
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only CLIENT can create project
    if (user.role !== "CLIENT") {
      return res.status(403).json({ message: "Only CLIENT can create projects" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure the logged-in CLIENT owns the job
    if (job.userId !== user.id) {
      return res.status(403).json({ message: "You do not own this job" });
    }

    // Check if an accepted proposal exists between this freelancer and job
    const acceptedProposal = await prisma.proposal.findFirst({
      where: {
        jobId,
        userId: freelancerId,
        status: "ACCEPTED", // Ensure status enum matches your schema
      },
    });

    if (!acceptedProposal) {
      return res.status(400).json({ message: "No accepted proposal found for this freelancer and job" });
    }

    const project = await prisma.project.create({
      data: {
        jobId,
        freelancerId,
        status: JobStatus.IN_PROGRESS,
      },
      include: {
        job: true,
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create project", error });
  }
};

export const getProjectsByFreelancer = async (req: Request, res: Response) => {
  const { freelancerId } = req.params;

  const projects = await prisma.project.findMany({
    where: { freelancerId },
    include: {
      job: true,
      review: true,
    },
  });

  res.json(projects);
};

export const getProjectsByClient = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const jobs = await prisma.job.findMany({
    where: { userId },
    select: { id: true },
  });

  const jobIds = jobs.map((j) => j.id);

  const projects = await prisma.project.findMany({
    where: { jobId: { in: jobIds } },
    include: {
      job: true,
      freelancer: true,
      review: true,
    },
  });

  res.json(projects);
};

export const updateProjectStatus = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const { status } = req.body;
  const userId = (req as any).user.id;

  try {
    // 🔍 1. Fetch the project with its associated job (including clientId)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        job: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔐 2. Check if the logged-in user is the owner (client) of the job
    if (userId !== project.job.userId) {
      return res.status(403).json({ message: "Only the job owner can update project status." });
    }

    // ✅ 3. Update the project status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    return res.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
