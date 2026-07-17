const mongoose = require("mongoose");
const ActorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    nationality: {
      type: String,
      maxLength: 50,
    },
    biography: {
      type: String,
      maxLength: 2000,
    },
    photo: {
      type: String, // URL de la photo
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Actor", ActorSchema);
