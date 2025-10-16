import express from "express";
import mongoose from "mongoose";
import { exec } from "child_process";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import User from "./models/User.js";
import Session from "./models/Session.js";

dotenv.config();

const { Types } = mongoose;
const USE_MOCK_AICHAT = process.env.MOCK_AICHAT === "true";
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected to: ", mongoose.connection.name))
    .catch(err=> console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Medigen backend is running!");
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { userId, symptomsText } = req.body;
    if (!userId || !symptomsText) {
      return res.status(400).json({ ok: false, error: "Missing userId or symptomsText" });
    }

    console.log("🧠 Incoming request from user:", userId, "Symptom:", symptomsText);

    // Try to find user safely
    const user = await User.findById(userId).catch(() => null);

    // 🔧 Create AI or mock response
    let ai_response = "";
    if (USE_MOCK_AICHAT) {
      ai_response = `Mock AI: Based on "${symptomsText}", possible causes include viral fever or fatigue.`;
    } else {
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
      console.log("🧾 AIChat response:", data);
      ai_response = data.choices?.[0]?.message?.content || "No response from AIChat.";
    }

    // ✅ Prepare session data safely
    const sessionData = {
      symptoms: symptomsText,
      ai_response,
    };

    if (user?._id) sessionData.user_id = user._id;

    const session = await Session.create(sessionData);

    res.json({ ok: true, ai_response, session_id: session._id });
  } catch (err) {
    console.error("❌ /api/analyze error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));