import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hospital_id: String,
    hospital_name: String,
    slot: Date,
    status: { type: String, default: "pending" },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);