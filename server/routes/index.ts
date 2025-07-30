import { Express } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import jobRoutes from "./job.routes";
import proposalRoutes from "./proposal.routes";
import adminRoutes from "./admin.routes";
import profileRoutes from "./profile.routes";
import projectRoutes from "./project.routes";
import reviewRoutes from "./review.routes";

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/", userRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/proposals", proposalRoutes);
  app.use("/admin", adminRoutes);
  app.use("/profile", profileRoutes);
  app.use("/", projectRoutes);
  app.use("/review", reviewRoutes);
};
