import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import User from "./models/User.js";
import Session from "./models/Session.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const USE_MOCK_AICHAT = false;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Health check route
app.get("/", (req, res) => {
  res.send("Medigen backend is running!");
});

// Analyze symptoms route
app.post("/api/analyze", async (req, res) => {
  try {
    const { userId, symptomsText } = req.body;

    if (!userId || !symptomsText) {
      return res.status(400).json({ ok: false, error: "Missing userId or symptomsText" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ ok: false, error: "Invalid userId format" });
    }

    // Find or create user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    // Use mock response if enabled
    if (USE_MOCK_AICHAT) {
      const ai_response = `Based on your symptoms, you might have a mild cold.`;
      const session = await Session.create({
        user_id: user._id,
        symptoms: symptomsText,
        ai_response
      });
      return res.json({ ok: true, ai_response, session_id: session._id });
    }

    // Call AI model
    const response = await fetch("http://127.0.0.1:8000/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemini:gemini-2.0-flash",
        messages: [
          { role: "system", content: "You are MediGen, a medical AI assistant." },
          { role: "user", content: symptomsText }
        ]
      })
    });

    const data = await response.json();
    console.log("🤖 Raw AIChat response:", data);

    const ai_response = data.choices?.[0]?.message?.content || "No response from AIChat.";

    const session = await Session.create({
      user_id: user._id,
      symptoms: symptomsText,
      ai_response
    });

    res.json({ ok: true, ai_response, session_id: session._id });

  } catch (err) {
    console.error("❌ Error in /api/analyze:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));