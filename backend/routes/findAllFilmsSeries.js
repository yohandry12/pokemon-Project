const auth = require("../src/auth/auth");
const mongoose = require("mongoose");
const Content = require("../src/models/MODÈLE CONTENU/films");
const Actor = require("../src/models/MODÈLE ACTEUR/acteur");
const Series = require("../src/models/MODÈLE ÉPISODE/series");

module.exports = (app) => {
  app.get("/api/contents", auth, async (req, res) => {
    try {
      if (req.query.title) {
        const title = req.query.title;
        const limit = parseInt(req.query.limit) || 5;
        if (title.length < 2) {
          const message = "Le terme de recherche doit contenir au moins 2 caractères.";
          return res.status(400).json({ message });
        }
        const regex = new RegExp(title, "i");
        // Recherche films
        const filmsPromise = Content.find({ title: regex })
          .limit(limit)
          .populate('genres')
          .populate('cast.actor')
          .exec();
        // Recherche séries
        const seriesPromise = Series.find({ title: regex })
          .limit(limit)
          .populate('genres')
          .populate('cast.actor')
          .exec();
        const [films, series] = await Promise.all([filmsPromise, seriesPromise]);
        // Harmonise le format pour le frontend
        const filmsWithType = films.map(f => ({ ...f.toObject(), type: "movie" }));
        const seriesWithType = series.map(s => ({
          ...s.toObject(),
          type: "series",
          poster: s.posterImage,
          synopsis: s.description,
          duration: s.seasons && s.seasons.length > 0
            ? s.seasons.reduce((acc, season) => acc + (season.episodes?.length || 0), 0) + " épisodes"
            : "",
          releaseDate: s.releaseDate,
          cast: s.cast || [],
        }));
        const results = [...filmsWithType, ...seriesWithType];
        const message = `Il y a ${results.length} contenus (films ou séries) qui correspondent au terme recherché '${title}'.`;
        return res.json({ message, data: results });
      } else {
        const contents = await Content.find().sort({ title: 1 })
          .populate('genres')
          .populate('cast.actor')
          .exec();
        const message = "La liste des films et séries a bien été récupérée.";
        return res.json({ message, data: contents });
      }
    } catch (error) {
      const message = "La liste des contenus n'a pas pu être récupérée.";
      return res.status(500).json({ message, error: error.message });
    }
  });

  // Nouveautés : 10 derniers contenus ajoutés
  app.get("/api/contents/new", async (req, res) => {
    try {
      const Content = require("../src/models/MODÈLE CONTENU/films");
      const news = await Content.find({ isPublic: true, status: "published" })
        .sort({ createdAt: -1 })
        .limit(10);
      res.json({ data: news });
    } catch (err) {
      console.error("Erreur lors de la récupération des news :", error);
      res.status(500).json({ message: err.message });
    }
  });

  // Tendances : 10 contenus les plus vus
  app.get("/api/contents/trending", async (req, res) => {
    try {
      const Content = require("../src/models/MODÈLE CONTENU/films");
      const trending = await Content.find({ isPublic: true, status: "published" })
        .sort({ views: -1 })
        .limit(5);
      res.json({ data: trending });
    } catch (err) {
      console.error("Erreur lors de la récupération des tendances :", error);
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/contents/:id", auth, async (req, res) => {
    try {
      const content = await Content.findById(req.params.id)
        .populate('genres')
        .populate('cast.actor');
      if (!content) {
        return res.status(404).json({ message: "Contenu non trouvé." });
      }
      res.json({ message: "Détail du contenu récupéré avec succès.", data: content });
    } catch (error) {
      console.error("Erreur lors de la récupération du détail :", error);
      res.status(500).json({ message: "Erreur lors de la récupération du contenu.", error: error.message });
    }
  });

  
}; 