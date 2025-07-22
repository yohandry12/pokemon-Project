const Payment = require("../src/models/MODÈLE PAIEMENT/paiement");
const SubscriptionPlan = require("../src/models/ABONNEMENT/abonnement");
const UserSubscription = require("../src/models/ABONNEMENT/userSubscription");
const auth = require("../src/auth/auth");

const paymentRoutes = (app) => {
    app.post("/api/pay", auth, async (req, res) => {
      try {
        const { planId, paymentMethod } = req.body;
        const userId = req.user._id;
    
        // Vérifier le plan
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: "Plan non trouvé" });
    
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
        // Pour la démo, on simule un paiement réussi :
        payment.status = "completed";
        payment.paidAt = new Date();
        await payment.save();
    
        // Activer l’abonnement
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
    
        res.json({
          message: "Paiement réussi, abonnement activé",
          payment,
          subscription: userSub,
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

  app.get("/api/payments", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const payments = await Payment.find({ user: userId })
        .populate("subscriptionPlan")
        .sort({ createdAt: -1 });
      res.json({ payments });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  };

  module.exports = paymentRoutes;