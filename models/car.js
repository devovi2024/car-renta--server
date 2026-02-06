import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const carSchema = new Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String }, 
  image: { type: String },
  category: { type: String, enum: ["Sedan","SUV","Hatchback","Luxury","Van"], required: true },
  seating_capacity: { type: Number, required: true },
  fuel_type: { type: String, enum: ["Petrol","Diesel","Electric","Hybrid"], required: true },
  transmission: { type: String, enum: ["Manual","Automatic"], required: true },
  pricePerDay: { type: Number, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default model("Car", carSchema);
