const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/user.model");

// Charger les variables d'environnement de ton fichier .env
dotenv.config();

// Récupérer les identifiants depuis les variables d'environnement
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Admin";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "User";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/handflix";

// Connexion à la base de données
const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log("Connecté à MongoDB pour le seeding...");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    process.exit(1); // Arrête le script si la connexion échoue
  }
};

const seedAdmin = async () => {
  await dbConnect();

  try {
    // 1. Vérifier si l'utilisateur admin existe déjà
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(
        "L'utilisateur administrateur existe déjà. Aucune action requise."
      );
      return;
    }

    // 2. Si l'admin n'existe pas, on le crée
    console.log(
      "L'utilisateur administrateur n'existe pas, création en cours..."
    );

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Créer le nouvel utilisateur avec le rôle 'admin'
    const adminUser = new User({
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      username: "admin", // Ajout du champ requis
      password: hashedPassword,
      role: "admin", // C'est le champ le plus important !
      isActive: true,
    });

    // Sauvegarder dans la base de données
    await adminUser.save();
    console.log("Utilisateur administrateur créé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
  } finally {
    // 3. Toujours fermer la connexion à la base de données
    mongoose.disconnect();
    console.log("Déconnecté de MongoDB.");
  }
};

// Lancer le script
seedAdmin();
