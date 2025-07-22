const auth = require("../src/auth/auth");
const Watchlist = require("../src/models/LISTE DE FAVORIS/favoris");
const Content = require("../src/models/MODÈLE CONTENU/films");
const Serie = require("../src/models/MODÈLE ÉPISODE/series");

module.exports = (app) => {
  // Récupérer la liste des favoris d'un utilisateur
  app.get("/api/favorites", auth, async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = require("jsonwebtoken").verify(
        token,
        require("../src/auth/private_key")
      );
      const userId = decodedToken.userId;

      let watchlist = await Watchlist.findOne({ user: userId });

      if (!watchlist) {
        // Créer une nouvelle liste de favoris si elle n'existe pas
        watchlist = new Watchlist({
          user: userId,
          name: "Ma liste",
          contents: [],
          series: [],
        });
        await watchlist.save();
      }

      // Populate les contenus pour avoir toutes les informations
      await watchlist.populate("contents.content");
      await watchlist.populate("series.serie");

      res.json({
        message: "Liste des favoris récupérée avec succès",
        data: watchlist,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des favoris",
        error: error.message,
      });
    }
  });

  // Ajouter un contenu aux favoris
  app.post("/api/favorites/add", auth, async (req, res) => {
    try {
      const { contentId, seriesId } = req.body;
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = require("jsonwebtoken").verify(
        token,
        require("../src/auth/private_key")
      );
      const userId = decodedToken.userId;

      let content = null;
      let serie = null;
      if (contentId) {
        content = await Content.findById(contentId);
        if (!content) {
          return res.status(404).json({ message: "Film non trouvé" });
        }
      }
      if (seriesId) {
        serie = await Serie.findById(seriesId);
        if (!serie) {
          return res.status(404).json({ message: "Série non trouvée" });
        }
      }
      if (!content && !serie) {
        return res.status(400).json({ message: "Aucun identifiant fourni" });
      }

      // Trouver ou créer la liste de favoris
      let watchlist = await Watchlist.findOne({ user: userId });
      if (!watchlist) {
        watchlist = new Watchlist({
          user: userId,
          name: "Ma liste",
          contents: [],
          series: [],
        });
      }

      // Vérifier si le contenu est déjà dans les favoris
      if (content) {
        const existingContent = watchlist.contents.find(
          (item) => item.content.toString() === contentId
        );
        if (existingContent) {
          return res.status(400).json({
            message: "Ce film est déjà dans vos favoris",
          });
        }
        watchlist.contents.push({
          content: contentId,
          addedAt: new Date(),
        });
      }
      if (serie) {
        const existingSerie = watchlist.series.find(
          (item) => item.serie.toString() === seriesId
        );
        if (existingSerie) {
          return res.status(400).json({
            message: "Cette série est déjà dans vos favoris",
          });
        }
        watchlist.series.push({
          serie: seriesId,
          addedAt: new Date(),
        });
      }

      await watchlist.save();
      await watchlist.populate("contents.content");
      await watchlist.populate("series.serie");

      res.status(201).json({
        message: "Contenu ajouté aux favoris avec succès",
        data: watchlist,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      res.status(500).json({
        message: "Erreur lors de l'ajout aux favoris",
        error: error.message,
      });
    }
  });

  // Supprimer un contenu ou une série des favoris
  app.delete("/api/favorites/remove/:contentId", auth, async (req, res) => {
    try {
      const { contentId } = req.params;
      const type = req.query.type; // "film" ou "series"
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = require("jsonwebtoken").verify(
        token,
        require("../src/auth/private_key")
      );
      const userId = decodedToken.userId;

      const watchlist = await Watchlist.findOne({ user: userId });
      if (!watchlist) {
        return res.status(404).json({
          message: "Liste de favoris non trouvée",
        });
      }

      if (type === "series") {
        // Supprime la série du tableau series
        watchlist.series = watchlist.series.filter(
          (item) => item.serie.toString() !== contentId
        );
      } else {
        // Supprime le film du tableau contents
        watchlist.contents = watchlist.contents.filter(
          (item) => item.content.toString() !== contentId
        );
      }

      await watchlist.save();
      await watchlist.populate("contents.content");
      await watchlist.populate("series.serie");

      res.json({
        message: "Contenu supprimé des favoris avec succès",
        data: watchlist,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris:", error);
      res.status(500).json({
        message: "Erreur lors de la suppression des favoris",
        error: error.message,
      });
    }
  });
};
