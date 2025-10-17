// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // 🔐 added password field
  location: { lat: Number, lng: Number },
  medical_history: [String],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
