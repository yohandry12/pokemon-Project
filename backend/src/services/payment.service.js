const Payment = require("../models/payment.model");
const SubscriptionPlan = require("../models/subscriptionPlan.model");
const UserSubscription = require("../models/userSubscription.model");
const ApiError = require("../utils/ApiError");

const pay = async (userId, { planId, paymentMethod }) => {
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan non trouvé");

  // Créer le paiement (statut pending)
  const payment = await Payment.create({
    user: userId,
    subscriptionPlan: plan._id,
    amount: plan.price,
    currency: plan.currency || "EUR",
    paymentMethod,
    status: "pending",
    paidAt: null,
  });

  // --- Ici tu peux intégrer Stripe/PayPal ou simuler le paiement ---
  // Pour la démo, on simule un paiement réussi :
  payment.status = "completed";
  payment.paidAt = new Date();
  await payment.save();

  // Activer l'abonnement
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.duration);

  // Désactiver les anciens abonnements
  await UserSubscription.updateMany(
    { user: userId, isActive: true },
    { isActive: false }
  );

  const userSub = await UserSubscription.create({
    user: userId,
    plan: plan._id,
    startDate,
    endDate,
    isActive: true,
  });

  return { payment, subscription: userSub };
};

const listUserPayments = (userId) =>
  Payment.find({ user: userId })
    .populate("subscriptionPlan")
    .sort({ createdAt: -1 });

module.exports = { pay, listUserPayments };
