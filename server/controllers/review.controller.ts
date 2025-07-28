import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../libs/prisma";

/**
 * @desc Create a review for a project by a client
 * @route POST /api/reviews
 * @access CLIENT only
 */
export const createReview = async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user;
  const { projectId, rating, comment } = req.body;

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (user.role !== "CLIENT") return res.status(403).json({ message: "Only clients can create reviews." });

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { job: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.job.userId !== user.id)
      return res.status(403).json({ message: "You are not the client for this project." });

    const existingReview = await prisma.review.findFirst({
      where: { projectId },
    });

    if (existingReview) {
      return res.status(400).json({ message: "Review already exists for this project." });
    }

    const review = await prisma.review.create({
      data: {
        projectId,
        clientId: user.id,
        freelancerId: project.freelancerId,
        rating,
        comment,
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  console.log("Fetching all reviews");
  try {
    console.log("Fetching all reviews");

    const reviews = await prisma.review.findMany({
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
        freelancer: {
          select: { id: true, name: true, email: true },
        },
        project: true,
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Get review by ID
 * @route GET /api/reviews/:id
 */
export const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        freelancer: { select: { id: true, name: true, email: true } },
        project: true,
      },
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc List all reviews for a freelancer
 * @route GET /api/reviews/freelancer/:freelancerId
 */
export const getReviewsByFreelancer = async (req: Request, res: Response) => {
  const { freelancerId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { freelancerId },
      include: {
        client: { select: { id: true, name: true } },
        project: { select: { id: true, status: true } },
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching freelancer reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc List all reviews given by a client
 * @route GET /api/reviews/client/:clientId
 */
export const getReviewsByClient = async (req: Request, res: Response) => {
  const { clientId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { clientId },
      include: {
        freelancer: { select: { id: true, name: true } },
        project: { select: { id: true, status: true } },
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching client reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
