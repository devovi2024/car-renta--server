import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/user.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/auth", protect, getUser);

export default router;
