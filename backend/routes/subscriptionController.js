const UserSubscription = require("../src/models/ABONNEMENT/userSubscription");
const SubscriptionPlan = require("../src/models/ABONNEMENT/abonnement");
const auth = require("../src/auth/auth");

module.exports = (app) => {
  app.post("/api/subscribe", auth, async (req, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user._id; // Nécessite un middleware d'auth

      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) return res.status(404).json({ message: "Plan non trouvé" });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.duration);

      // Désactive les anciens abonnements actifs
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

      res.json({ message: "Abonnement souscrit", subscription: userSub });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/active", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      // Met à jour les abonnements expirés (endDate < aujourd'hui)
      await UserSubscription.updateMany(
        { user: userId, isActive: true, endDate: { $lt: new Date() } },
        { isActive: false, isCanceled: false }
      );
      const sub = await UserSubscription.findOne({
        user: userId,
        isActive: true,
      }).populate("plan");
      if (!sub) return res.json({ subscription: null });
      res.json({ subscription: sub });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/cancel", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      await UserSubscription.updateMany(
        { user: userId, isActive: true },
        { isActive: false, isCanceled: true }
      );
      res.json({ message: "Abonnement annulé" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Nouvelle route pour récupérer les plans d'abonnement actifs
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await SubscriptionPlan.find({ isActive: true });
      res.json({ data: plans });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

    // Route pour lister l'historique des abonnements de l'utilisateur
    app.get("/api/subscriptions", auth, async (req, res) => {
      try {
        const userId = req.user._id;
        // Met à jour les abonnements expirés (endDate < aujourd'hui)
        await UserSubscription.updateMany(
          { user: userId, isActive: true, endDate: { $lt: new Date() } },
          { isActive: false, isCanceled: false }
        );
        const subs = await UserSubscription.find({ user: userId })
          .populate("plan")
          .sort({ startDate: -1 });
        res.json({ subscriptions: subs });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
};
