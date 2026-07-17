const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { jwtSecret, admin } = require("../config/env");
const ApiError = require("../utils/ApiError");

const register = async ({ firstName, lastName, email, username, password }) => {
  if (!email || !password || !firstName || !lastName || !username) {
    throw new ApiError(400, "Tous les champs sont obligatoires.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Cet email est déjà utilisé.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
  });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "48h" });
  return { user, token };
};

const login = async ({ email, password }) => {
  // Cas admin (identifiants depuis les variables d'environnement)
  if (email === admin.email && password === admin.password) {
    const adminUser = {
      id: "admin-id",
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      isAdmin: true,
    };
    const token = jwt.sign({ userId: adminUser.id, isAdmin: true }, jwtSecret, {
      expiresIn: "78h",
    });
    return {
      message: `L'administrateur a été connecté avec succès`,
      user: adminUser,
      token,
    };
  }

  // Cas utilisateur classique
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, `L'utilisateur demandé n'existe pas.`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, `Le mot de passe est incorrect.`);
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "48h" });
  return {
    message: `L'utilisateur a été connecté avec succès`,
    user,
    token,
  };
};

module.exports = { register, login };
