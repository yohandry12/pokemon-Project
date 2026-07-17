const adminUserService = require("../services/adminUser.service");
const ApiError = require("../utils/ApiError");

const list = async (req, res) => {
  try {
    const users = await adminUserService.listUsers();
    res.json({ message: "Liste des utilisateurs récupérée.", data: users });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération.",
      error: err.message,
    });
  }
};

const setActive = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await adminUserService.setActive(req.params.userId, isActive);
    res.json({
      message: `Utilisateur ${isActive ? "activé" : "désactivé"}.`,
      data: user,
    });
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    res.status(500).json({
      message: "Erreur lors de la modification.",
      error: err.message,
    });
  }
};

const remove = async (req, res, next) => {
  try {
    await adminUserService.deleteUser(req.params.userId);
    res.json({ message: "Utilisateur supprimé." });
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    res.status(500).json({
      message: "Erreur lors de la suppression.",
      error: err.message,
    });
  }
};

module.exports = { list, setActive, remove };
