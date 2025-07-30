import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { registerRoutes } from "./routes/index";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:3000", // or your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

registerRoutes(app); // 👈 call this to register all routes in one place

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
