const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    // Informations paiement
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "EUR",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      required: true,
    },

    // Références externes
    stripePaymentId: String,
    paypalTransactionId: String,

    // Statut
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Dates
    paidAt: Date,
    refundedAt: Date,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Payment", PaymentSchema);
