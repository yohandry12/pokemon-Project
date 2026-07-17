const mongoose = require("mongoose");

const UserSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isCanceled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
