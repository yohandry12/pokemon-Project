const favoriteService = require("../services/favorite.service");
const ApiError = require("../utils/ApiError");

const list = async (req, res, next) => {
  try {
    const watchlist = await favoriteService.getFavorites(req.user._id);
    res.json({ message: "Liste des favoris récupérée avec succès", data: watchlist });
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des favoris",
      error: error.message,
    });
  }
};

const add = async (req, res, next) => {
  try {
    const watchlist = await favoriteService.addFavorite(req.user._id, req.body);
    res.status(201).json({
      message: "Contenu ajouté aux favoris avec succès",
      data: watchlist,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    console.error("Erreur lors de l'ajout aux favoris:", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout aux favoris",
      error: error.message,
    });
  }
};

const remove = async (req, res, next) => {
  try {
    const watchlist = await favoriteService.removeFavorite(
      req.user._id,
      req.params.contentId,
      req.query.type // "film" ou "series"
    );
    res.json({
      message: "Contenu supprimé des favoris avec succès",
      data: watchlist,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    console.error("Erreur lors de la suppression des favoris:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression des favoris",
      error: error.message,
    });
  }
};

module.exports = { list, add, remove };
