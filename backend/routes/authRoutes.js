// backend/routes/authRoutes.js
import express from "express";
import { signup, login, me, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup); // alias for your frontend
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
