import express from "express";
import { registerUser, loginUser, getUser, getCars } from "../controllers/user.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUser);
router.get("/cars", getCars);


export default router;
