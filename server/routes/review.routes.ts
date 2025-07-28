import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByClient,
  getReviewsByFreelancer,
} from "../controllers/review.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All review routes protected
router.use(authMiddleware);

router.post("/", createReview);
router.get("/reviews", getAllReviews);
router.get("/:id", getReviewById);
router.get("/freelancer/:freelancerId", getReviewsByFreelancer);
router.get("/client/:clientId", getReviewsByClient);

export default router;
