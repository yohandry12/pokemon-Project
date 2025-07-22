const User = require("../src/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../src/auth/private_key");

// Identifiants admin depuis les variables d'environnement
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Admin";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "User";

module.exports = (app) => {
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    // Cas admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: "admin-id",
        email: ADMIN_EMAIL,
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        isAdmin: true,
      };
      const token = jwt.sign(
        { userId: adminUser.id, isAdmin: true },
        privateKey,
        {
          expiresIn: "78h",
        }
      );
      const message = `L'administrateur a été connecté avec succès`;
      return res.json({ message, data: adminUser, token });
    }
    // Cas utilisateur classique
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          const message = `L'utilisateur demandé n'existe pas.`;
          return res.status(404).json({ message });
        }

        return bcrypt
          .compare(req.body.password, user.password)
          .then((isPasswordValid) => {
            if (!isPasswordValid) {
              const message = `Le mot de passe est incorrect.`;
              return res.status(401).json({ message });
            }

            const token = jwt.sign({ userId: user.id }, privateKey, {
              expiresIn: "48h",
            });

            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token });
          });
      })
      .catch((error) => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
        return res.status(500).json({ message, data: error });
      });
  });
};
