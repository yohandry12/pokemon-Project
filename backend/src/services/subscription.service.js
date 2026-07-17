const UserSubscription = require("../models/userSubscription.model");
const SubscriptionPlan = require("../models/subscriptionPlan.model");
const ApiError = require("../utils/ApiError");

// Désactive les abonnements dont la date de fin est dépassée
const deactivateExpired = (userId) =>
  UserSubscription.updateMany(
    { user: userId, isActive: true, endDate: { $lt: new Date() } },
    { isActive: false, isCanceled: false }
  );

const subscribe = async (userId, planId) => {
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan non trouvé");

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.duration);

  // Désactive les anciens abonnements actifs
  await UserSubscription.updateMany(
    { user: userId, isActive: true },
    { isActive: false }
  );

  return UserSubscription.create({
    user: userId,
    plan: plan._id,
    startDate,
    endDate,
    isActive: true,
  });
};

const getActive = async (userId) => {
  await deactivateExpired(userId);
  return UserSubscription.findOne({ user: userId, isActive: true }).populate(
    "plan"
  );
};

const cancel = (userId) =>
  UserSubscription.updateMany(
    { user: userId, isActive: true },
    { isActive: false, isCanceled: true }
  );

const listPlans = () => SubscriptionPlan.find({ isActive: true });

const listUserSubscriptions = async (userId) => {
  await deactivateExpired(userId);
  return UserSubscription.find({ user: userId })
    .populate("plan")
    .sort({ startDate: -1 });
};

module.exports = {
  subscribe,
  getActive,
  cancel,
  listPlans,
  listUserSubscriptions,
};
