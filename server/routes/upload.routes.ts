// routes/uploadRoutes.ts
import express from "express";
import multer from "multer";
import { uploadProfileImage } from "../controllers/upload.conroller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload-profile-image", authMiddleware, upload.single("profileImage"), uploadProfileImage);

export default router;
