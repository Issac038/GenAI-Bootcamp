import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import appointmentRoutes from "./routes/appointment.js";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import User from "./models/User.js";
import Session from "./models/Session.js";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const USE_MOCK_AICHAT = false; // Set true if you want mock AI responses

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Health check
app.get("/", (req, res) => res.send("Medigen backend is running!"));

// ✅ Analyze symptoms route
app.post("/api/analyze", async (req, res) => {
  try {
    const { userId, symptomsText } = req.body;

    if (!userId || !symptomsText) {
      return res.status(400).json({ ok: false, error: "Missing userId or symptomsText" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ ok: false, error: "Invalid userId format" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    let ai_response = "";
    let severity = "Mild";

    if (USE_MOCK_AICHAT) {
      // Mock AI response
      ai_response = "You may have a mild cold. Rest, hydrate, and monitor symptoms.";
    } else {
      // Call real AI model
      const response = await fetch("http://127.0.0.1:8000/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini:gemini-2.0-flash",
          messages: [
            { role: "system", content: "You are MediGen, a medical AI assistant. Ask clarifying questions if needed and provide short, clear bullet-point recommendations. Always include a disclaimer." },
            { role: "user", content: symptomsText }
          ]
        })
      });

      const data = await response.json();
      console.log("🤖 Raw AI response:", data);

      ai_response = data.choices?.[0]?.message?.content || "No response from AI.";

      // Optional: simple severity detection
      if (symptomsText.toLowerCase().includes("headache") && symptomsText.toLowerCase().includes("body pain")) {
        severity = "Moderate";
      }
    }

    // Save session
    const session = await Session.create({
      user_id: user._id,
      symptoms: symptomsText,
      ai_response,
      metadata: { severity }
    });

    // Respond to frontend
    res.json({
      ok: true,
      ai_response,
      severity,
      session_id: session._id
    });

  } catch (err) {
    console.error("Error in /api/analyze:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/sessions", sessionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));