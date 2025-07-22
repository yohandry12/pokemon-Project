const express = require("express");
const Rating = require("../src/models/MODÈLE ÉVALUATION/evaluation");
const auth = require("../src/auth/auth");

module.exports = (app) => {
  // Récupérer toutes les évaluations d'un contenu
  app.get("/api/ratings/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      const ratings = await Rating.find({ content: contentId, isPublic: true })
        .populate("user", "firstName lastName avatar")
        .sort({ createdAt: -1 });
      res.json({ data: ratings });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Ajouter ou mettre à jour une évaluation pour un utilisateur/contenu
  app.post("/api/ratings/:contentId", auth, async (req, res) => {
    try {
      const { contentId } = req.params;
      const userId = req.user._id;
      const { rating, review } = req.body;
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Note invalide (1 à 5)" });
      }
      let eval = await Rating.findOne({ user: userId, content: contentId });
      if (eval) {
        eval.rating = rating;
        eval.review = review;
        await eval.save();
      } else {
        eval = await Rating.create({ user: userId, content: contentId, rating, review });
      }
      res.json({ message: "Évaluation enregistrée", data: eval });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Supprimer une évaluation (par l'utilisateur)
  app.delete("/api/ratings/:contentId", auth, async (req, res) => {
    try {
      const { contentId } = req.params;
      const userId = req.user._id;
      await Rating.deleteOne({ user: userId, content: contentId });
      res.json({ message: "Évaluation supprimée" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}; 