import express from "express"; // Express: Used to create REST APIs
import dotenv from "dotenv"; // dotenv: Loads environment variables from .env
import sequelize from "./config/db"; // Import Sequelize connection
import authRoutes from "./routes/auth.routes"; // Auth API routes
import cors from "cors";

dotenv.config(); // Loads variables from `.env` file
const app = express();

app.use(
  cors({
    origin: "*", // Allow all origins (not for production)
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json()); // Middleware to parse JSON request bodies

app.use("/api/auth", authRoutes); // Mount `/api/auth` routes (like /register, /login)

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
