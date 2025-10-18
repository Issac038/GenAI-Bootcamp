import express from "express";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import User from "../models/User.js";

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

// ✅ GET latest session report
router.get("/latest", verifyToken, async (req, res) => {
  try {
    // Find latest session for logged-in user
    const session = await Session.findOne({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .lean();

    if (!session)
      return res.status(404).json({ message: "No session found" });

    // Get user info
    const user = await User.findById(req.user.id).lean();

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      symptoms: session.symptoms,
      ai_response: session.ai_response,
      metadata: session.metadata,
      created_at: session.created_at,
    });
  } catch (err) {
    console.error("Error fetching session:", err);
    res.status(500).json({ message: "Error fetching session data" });
  }
});

export default router;
