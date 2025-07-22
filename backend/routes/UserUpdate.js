const express = require("express");
const router = express.Router();
const User = require("../src/models/user");
const auth = require("../src/auth/auth"); // Middleware d'authentification

// Met à jour le profil utilisateur connecté
module.exports = (app) => {
  app.put("/profile", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const { firstName, lastName, email, avatar, password } = req.body;

      // Prépare les champs à mettre à jour
      const updateFields = { firstName, lastName, email };
      if (avatar) updateFields.avatar = avatar;
      if (password) {
        const bcrypt = require("bcryptjs");
        updateFields.password = await bcrypt.hash(password, 10);
      }

      // Met à jour l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select("-password"); // Ne retourne pas le hash du mot de passe

      res.json({ message: "Profil mis à jour", user: updatedUser });
    } catch (err) {
      console.error("Erreur update profil :", err); // Ajoute ceci
      res.status(500).json({ message: err.message });
    }
  });
};
