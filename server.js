import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routes/user.route.js";
import ownerRouter from "./routes/owner.route.js";
import bookingRoute from "./routes/booking.route.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true
  })
);

app.use("/api/auth", authRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRoute);

app.get("/", (req, res) => {
  res.send("API running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

export default app;
