import express from "express";
import { checkAvailabilityOfCars, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } from "../controllers/booking.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/check", protect, checkAvailabilityOfCars);
router.post("/create", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/owner", protect, getOwnerBookings);
router.put("/status", protect, changeBookingStatus);

export default router;
