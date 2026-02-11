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
    origin: "https://car-rental-201.vercel.app",
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
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
