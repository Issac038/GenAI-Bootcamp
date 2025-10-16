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
const USE_MOCK_AICHAT = false; // Set true for demo/testing without aichat`

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Medigen backend is running!");
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { userId, symptomsText } = req.body;
    if (!userId || !symptomsText) 
      return res.status(400).json({ ok: false, error: "Missing userId or symptomsText" });

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) 
      return res.status(400).json({ ok: false, error: "Invalid userId format" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });

    if (USE_MOCK_AICHAT) {
      const ai_response = `Based on your symptoms, you might have a mild cold.`;
      const session = await Session.create({
        user_id: user._id,
        symptoms: symptomsText,
        ai_response
      });
      return res.json({ ok: true, ai_response, session_id: session._id });
    }


    const response = await fetch('http://127.0.0.1:8000/v1/chat/completions', {
      method: 'POST',
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
    const ai_response_raw = data.choices?.[0]?.message?.content || "No response from AIChat.";

    const session = await Session.create({
      user_id: user._id,
      symptoms: symptomsText,
      ai_response: ai_response_raw
    });

    res.json({ ok: true, ai_response: ai_response_raw, session_id: session._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
