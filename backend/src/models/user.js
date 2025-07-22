const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema(
  {
    // Informations personnelles
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email invalide"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20,
    },

    // Authentification
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // Profil utilisateur
    avatar: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    country: {
      type: String,
      maxLength: 50,
    },
    language: {
      type: String,
      default: "fr",
      enum: ["fr", "en", "es", "de"],
    },

    // Préférences
    preferences: {
      genres: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Genre",
        },
      ],
      qualityPreference: {
        type: String,
        enum: ["720p", "1080p", "4K"],
        default: "720p",
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      subtitles: {
        type: Boolean,
        default: false,
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },

    // Abonnement
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false,
      },
      autoRenewal: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
