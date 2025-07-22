const express = require("express");
const auth = require("../../src/auth/auth");
const User = require("../../src/models/user");

module.exports = (app) => {
  // Lister tous les utilisateurs
  app.get("/api/admin/users", auth, async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({ message: "Liste des utilisateurs récupérée.", data: users });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération.",
          error: err.message,
        });
    }
  });

  // Activer/désactiver un utilisateur
  app.patch("/api/admin/users/:userId/activate", auth, async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select("-password");
      if (!user)
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      res.json({
        message: `Utilisateur ${isActive ? "activé" : "désactivé"}.`,
        data: user,
      });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la modification.",
          error: err.message,
        });
    }
  });

  // Supprimer un utilisateur
  app.delete("/api/admin/users/:userId", auth, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndDelete(userId);
      if (!user)
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      res.json({ message: "Utilisateur supprimé." });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression.",
          error: err.message,
        });
    }
  });
};
