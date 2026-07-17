const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    fullName: { type: String, required: true, trim: true, maxLength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxLength: 200 },
    message: { type: String, required: true, trim: true, maxLength: 5000 },
    topic: { type: String, required: true, trim: true, enum: ["Support", "Facturation", "Suggestion", "Autre"], default: "Support" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    reply: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);


