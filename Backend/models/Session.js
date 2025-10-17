import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    symptoms: String,
    ai_response: String,
    metadata: Object,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Session", sessionSchema);