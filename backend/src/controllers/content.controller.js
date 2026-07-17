const contentService = require("../services/content.service");
const ApiError = require("../utils/ApiError");

const list = async (req, res, next) => {
  try {
    if (req.query.title) {
      const title = req.query.title;
      const limit = parseInt(req.query.limit) || 5;
      const results = await contentService.search(title, limit);
      const message = `Il y a ${results.length} contenus (films ou séries) qui correspondent au terme recherché '${title}'.`;
      return res.json({ message, data: results });
    }
    const contents = await contentService.listAll();
    const message = "La liste des films et séries a bien été récupérée.";
    return res.json({ message, data: contents });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    const message = "La liste des contenus n'a pas pu être récupérée.";
    return res.status(500).json({ message, error: error.message });
  }
};

const listNew = async (req, res, next) => {
  try {
    const news = await contentService.listNew();
    res.json({ data: news });
  } catch (err) {
    console.error("Erreur lors de la récupération des news :", err);
    next(err);
  }
};

const listTrending = async (req, res, next) => {
  try {
    const trending = await contentService.listTrending();
    res.json({ data: trending });
  } catch (err) {
    console.error("Erreur lors de la récupération des tendances :", err);
    next(err);
  }
};

const getById = async (req, res) => {
  try {
    const content = await contentService.getById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Contenu non trouvé." });
    }
    res.json({ message: "Détail du contenu récupéré avec succès.", data: content });
  } catch (error) {
    console.error("Erreur lors de la récupération du détail :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération du contenu.",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const content = await contentService.create(req.body);
    const message = `Le contenu '${content.title}' a bien été créé.`;
    res.status(201).json({ message, data: content });
  } catch (error) {
    const messageError =
      "Le contenu n'a pas pu être créé. Vérifiez les données envoyées.";
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: messageError, data: error });
    }
    res.status(500).json({ message: messageError, data: error });
  }
};

const update = async (req, res, next) => {
  try {
    const updatedContent = await contentService.update(
      req.params.contentId,
      req.body
    );
    res.json({ message: "Contenu mis à jour avec succès", data: updatedContent });
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    console.error("Erreur lors de la mise à jour du contenu :", err);
    res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err.message });
  }
};

module.exports = { list, listNew, listTrending, getById, create, update };
