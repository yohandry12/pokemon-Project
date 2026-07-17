const seriesService = require("../services/series.service");
const ApiError = require("../utils/ApiError");

const list = async (req, res) => {
  try {
    const seriesList = await seriesService.listAll();
    res.json({ message: "Liste des séries récupérée avec succès.", data: seriesList });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des séries.",
      error: error.message,
    });
  }
};

const listNew = async (req, res, next) => {
  try {
    const news = await seriesService.listNew();
    res.json({ data: news });
  } catch (err) {
    next(err);
  }
};

const listTrending = async (req, res, next) => {
  try {
    const trending = await seriesService.listTrending();
    res.json({ data: trending });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const seriesWithEpisodes = await seriesService.getById(req.params.id);
    res.json({
      message: "Détails de la série récupérés avec succès.",
      data: seriesWithEpisodes,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des détails.",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const finalSeries = await seriesService.create(req.body);
    res.status(201).json({ message: "Série créée avec succès!", data: finalSeries });
  } catch (error) {
    console.error("Erreur POST /api/series :", error);
    res.status(500).json({
      message: "Erreur lors de la création de la série.",
      error: error.message,
    });
  }
};

const update = async (req, res, next) => {
  try {
    const updatedSeries = await seriesService.update(req.params.seriesId, req.body);
    res.json({ message: "Série mise à jour avec succès", data: updatedSeries });
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    console.error("Erreur lors de la mise à jour de la série :", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Erreurs de validation", errors: err.errors });
    }
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour.",
      error: err.message,
    });
  }
};

module.exports = { list, listNew, listTrending, getById, create, update };
