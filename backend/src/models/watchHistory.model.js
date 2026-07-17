const mongoose = require("mongoose");
const WatchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    episode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      required: false, // null pour les films
    },

    // Progression
    watchedDuration: {
      type: Number, // en secondes
      required: true,
      default: 0,
    },
    totalDuration: {
      type: Number, // durée totale en secondes
      required: true,
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Statut
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },

    // Informations techniques
    quality: {
      type: String,
      enum: ["720p", "1080p", "4K"],
    },
    device: {
      type: String, // type d'appareil utilisé
      enum: ["web", "mobile", "tablet", "tv"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("WatchHistory", WatchHistorySchema);
