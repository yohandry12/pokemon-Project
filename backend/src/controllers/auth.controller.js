const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    return res.status(201).json({
      message: "Utilisateur créé avec succès.",
      data: user,
      token,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { message, user, token } = await authService.login(req.body);
    return res.json({ message, data: user, token });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
    return res.status(500).json({ message, data: error });
  }
};

module.exports = { register, login };
