const User = require("../src/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../src/auth/private_key");

module.exports = (app) => {
  app.post("/api/register", async (req, res) => {
    try {
      const { firstName, lastName, email, username, password} = req.body;

      // Validation des champs
      if (!email || !password || !firstName || !lastName || !username) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont obligatoires." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        username: username,
      });

      // Création du token JWT
      const token = jwt.sign({ userId: user.id }, privateKey, {
        expiresIn: "48h",
      });

      return res.status(201).json({
        message: "Utilisateur créé avec succès.",
        data: user,
        token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};
