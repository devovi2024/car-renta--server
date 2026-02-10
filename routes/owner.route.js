import express from "express";
import { chnageRoleToOwner, addCar, getOwnersCars, toggleCarAvailability, deleteCar, getDashboardData, updateUserImage, getSingleOwnerCar } from "../controllers/owner.controller.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/change-role", protect, chnageRoleToOwner);
router.post("/add-car", protect, upload.single("image"), addCar);

router.get("/cars", protect, getOwnersCars);
router.get("/car/:id", getSingleOwnerCar);
router.put("/toggle/:id", protect, toggleCarAvailability);
router.delete("/car/:id", protect, deleteCar);
router.get("/dashboard", protect, getDashboardData);
router.post("/update-image", protect, upload.single("image"), updateUserImage);

export default router;
