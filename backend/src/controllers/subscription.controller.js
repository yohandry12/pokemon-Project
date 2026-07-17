const subscriptionService = require("../services/subscription.service");

const subscribe = async (req, res, next) => {
  try {
    const userSub = await subscriptionService.subscribe(
      req.user._id,
      req.body.planId
    );
    res.json({ message: "Abonnement souscrit", subscription: userSub });
  } catch (err) {
    next(err);
  }
};

const getActive = async (req, res, next) => {
  try {
    const sub = await subscriptionService.getActive(req.user._id);
    if (!sub) return res.json({ subscription: null });
    res.json({ subscription: sub });
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    await subscriptionService.cancel(req.user._id);
    res.json({ message: "Abonnement annulé" });
  } catch (err) {
    next(err);
  }
};

const listPlans = async (req, res, next) => {
  try {
    const plans = await subscriptionService.listPlans();
    res.json({ data: plans });
  } catch (err) {
    next(err);
  }
};

const listUserSubscriptions = async (req, res, next) => {
  try {
    const subs = await subscriptionService.listUserSubscriptions(req.user._id);
    res.json({ subscriptions: subs });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  subscribe,
  getActive,
  cancel,
  listPlans,
  listUserSubscriptions,
};
