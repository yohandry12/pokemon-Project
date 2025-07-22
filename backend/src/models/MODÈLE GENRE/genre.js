const mongoose = require("mongoose");
const GenreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    color: {
      type: String, // code couleur hexadécimal
      default: "#000000",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Genre", GenreSchema);
