const mongoose = require("mongoose");
const SubscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "EUR",
      enum: ["EUR", "USD", "GBP"],
    },
    duration: {
      type: Number, // durée en jours
      required: true,
    },

    // Fonctionnalités
    features: {
      maxDevices: {
        type: Number,
        default: 1,
      },
      maxQuality: {
        type: String,
        enum: ["720p", "1080p", "4K"],
        default: "720p",
      },
      downloadAllowed: {
        type: Boolean,
        default: false,
      },
      adsEnabled: {
        type: Boolean,
        default: true,
      },
    },

    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
