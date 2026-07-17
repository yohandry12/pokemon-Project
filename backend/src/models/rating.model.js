const mongoose = require("mongoose");
const RatingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxLength: 1000,
      required: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Rating", RatingSchema);
