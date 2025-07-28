import { Request, Response } from "express";
import { PrismaClient, Role, JobStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// ✅ Create a Job (CLIENT only)
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget, category } = req.body;
    const user = req.user;

    if (!user || user.role !== Role.CLIENT) {
      return res.status(403).json({ message: "Only clients can create jobs." });
    }

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "Title, description, and budget are required." });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget,
        category,
        userId: user.id,
        status: JobStatus.OPEN,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Error creating job", error });
  }
};

// ✅ Get All Jobs (Public or Authenticated)
export const getAllJobs = async (_: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true },
        },
        proposals: {
          select: { id: true, userId: true, status: true },
        },
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs", error });
  }
};

// ✅ Get Job by ID (with proposals + postedBy info)
export const getJobById = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  console.log("Fetching job with ID:", jobId);

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        postedBy: {
          select: { id: true, name: true },
        },
        proposals: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    res.status(500).json({ message: "Error fetching job", error });
  }
};

// ✅ Update Job Status (CLIENT or ADMIN)
export const updateJobStatus = async (req: AuthRequest, res: Response) => {
  const { jobId } = req.params;
  const { status } = req.body;
  const user = req.user;
  console.log("Updating job status for job ID:", user);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only job owner or ADMIN can update
    if (user.role !== Role.ADMIN && job.userId !== user.id) {
      return res.status(403).json({ message: "You are not authorized to update this job" });
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });

    res.json({ message: "Job status updated", job: updated });
  } catch (error) {
    console.error("Update Job Status Error:", error);
    res.status(500).json({ message: "Failed to update job status", error });
  }
};

// ✅ Delete Job (CLIENT who owns it or ADMIN)
export const deleteJob = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only job owner or ADMIN can delete
    if (user.role !== Role.ADMIN && job.userId !== user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this job" });
    }

    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Error deleting job", error });
  }
};
