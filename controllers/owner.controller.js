import fs from "fs";
import User from "../models/user.js";
import Car from "../models/car.js";
import Booking from "../models/booking.js";
import { getImageKitInstance } from "../lib/imagekit.js";

export const chnageRoleToOwner = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.role = "owner";
    await user.save();
    res.json({ success: true, message: "Role changed to owner" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addCar = async (req, res) => {
  try {
    const carData = JSON.parse(req.body.carData);
    const imageFile = req.file;
    let image = "";
    if (imageFile) {
      const buffer = fs.readFileSync(imageFile.path);
      const imagekit = getImageKitInstance();
      const uploadRes = await imagekit.upload({ file: buffer, fileName: imageFile.originalname, folder: "cars" });
      image = imagekit.url({ path: uploadRes.filePath, transformation: [{ width: 1280 }, { quality: "auto" }, { format: "webp" }] });
      fs.unlinkSync(imageFile.path);
    }
    const car = await Car.create({ ...carData, owner: req.user._id, image });
    res.status(201).json({ success: true, car });
  } catch {
    res.status(500).json({ success: false, message: "Failed to add car" });
  }
};

export const getSingleOwnerCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getOwnersCars = async (req, res) => {
  try {
    console.log("User in request:", req.user);
    const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });
    console.log("Cars fetched:", cars);
    res.json({ success: true, cars });
  } catch (error) {
    console.error("Error in getOwnersCars:", error);
    res.status(500).json({ success: false, message: "Failed to fetch cars" });
  }
};


export const toggleCarAvailability = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user._id });
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, isAvailable: car.isAvailable });
  } catch {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });
    res.json({ success: true, message: "Car deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const cars = await Car.find({ owner: ownerId });
    const bookings = await Booking.find({ owner: ownerId }).sort({ createdAt: -1 });
    const pendingBookings = bookings.filter(b => b.status === "pending");
    const completeBookings = bookings.filter(b => b.status === "completed");
    const monthlyRevenue = bookings.filter(b => b.status === "confirmed").reduce((acc, b) => acc + b.price, 0);
    res.json({
      success: true,
      stats: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completeBookings: completeBookings.length,
        monthlyRevenue,
        recentBooking: bookings[0] || null
      }
    });
  } catch {
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
};

export const updateUserImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const imageFile = req.file;
    if (!imageFile) return res.json({ success: false, message: "No file uploaded" });
    const buffer = fs.readFileSync(imageFile.path);
    const imagekit = getImageKitInstance();
    const uploadRes = await imagekit.upload({ file: buffer, fileName: imageFile.originalname, folder: "users" });
    const image = imagekit.url({ path: uploadRes.filePath, transformation: [{ width: 1280 }, { quality: "auto" }, { format: "webp" }] });
    fs.unlinkSync(imageFile.path);
    await User.findByIdAndUpdate(userId, { image });
    res.json({ success: true, image });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update image" });
  }
};
