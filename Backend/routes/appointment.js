import express from "express";
import jwt from "jsonwebtoken";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// POST: book appointment
router.post("/", verifyToken, async (req, res) => {
  const { hospital_id, hospital_name, slot } = req.body;
  if (!hospital_id || !hospital_name || !slot)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const appointment = new Appointment({
      user_id: req.user.id,
      hospital_id,
      hospital_name,
      slot,
    });
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error booking appointment" });
  }
});

// GET: user appointments
router.get("/", verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user_id: req.user.id });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

export default router;
