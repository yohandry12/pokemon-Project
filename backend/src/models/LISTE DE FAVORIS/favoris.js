const mongoose = require("mongoose");
const WatchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Ma liste",
    },
    contents: [
      {
        content: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Content",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    series: [
      {
        serie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Series",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Watchlist", WatchlistSchema);
