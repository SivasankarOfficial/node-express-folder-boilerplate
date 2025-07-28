import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes"; // your route file
import userRoutes from "./routes/user.routes";
import jobRoutes from "./routes/job.routes";
import proposalRoutes from "./routes/proposal.routes";
import adminRoutes from "./routes/admin.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import reviewRoutes from "./routes/review.routes"; // your route file
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/admin", adminRoutes);
app.use("/profile", profileRoutes);
app.use("/", projectRoutes);
app.use("/review", reviewRoutes);

const PORT = process.env.PORT || 5000;

// Start server after checking DB connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
