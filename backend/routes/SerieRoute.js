const auth = require("../src/auth/auth");
const mongoose = require("mongoose");
// Assurez-vous que les chemins sont corrects
const Series = require("../src/models/MODÈLE ÉPISODE/series"); // Le modèle principal
const Episode = require("../src/models/MODÈLE ÉPISODE/Episode"); // Le modèle pour les épisodes
const Actor = require("../src/models/MODÈLE ACTEUR/acteur")
module.exports = (app) => {
  // --- ROUTES EXISTANTES (avec une petite correction) ---

  // GET: Récupérer toutes les séries
  app.get("/api/series", auth, async (req, res) => {
    try {
      const seriesList = await Series.find({ contentType: 'Serie' })
      .populate({
        path: 'cast.actor', // Chemin vers le champ à peupler
        model: 'Actor'      // Nom du modèle référencé
     });
      res.json({ message: "Liste des séries récupérée avec succès.", data: seriesList });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des séries.", error: error.message });
    }
  });

  // Nouvelles séries : 10 dernières séries créées
  app.get("/api/series/new", async (req, res) => {
    try {
      const Series = require("../src/models/MODÈLE ÉPISODE/series");
      const news = await Series.find({})
        .sort({ createdAt: -1 })
        .limit(5);
      res.json({ data: news });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Séries tendances : 10 séries les plus vues (si champ views existe)
  app.get("/api/series/trending", async (req, res) => {
    try {
      const Series = require("../src/models/MODÈLE ÉPISODE/series");
      // Si le champ views n'existe pas, on trie par createdAt
      const trending = await Series.find({})
        .sort({ views: -1, createdAt: -1 })
        .limit(5);
      res.json({ data: trending });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET: Récupérer une série par ID
  app.get("/api/series/:id", auth, async (req, res) => {
    try {
      const seriesId = req.params.id;
      const seriesList = await Series.find({ contentType: 'Serie' })
      if (!mongoose.Types.ObjectId.isValid(seriesId)) {
        return res.status(400).json({ message: "ID de série invalide." });
      }
      const seriesWithEpisodes = await Series.findById(seriesId).populate({
        path: 'seasons.episodes',
        model: 'Episode'
      })
      .populate({
        path: 'cast.actor',
        model: 'Actor'
      });
      if (!seriesWithEpisodes || seriesWithEpisodes.contentType !== 'Serie') {
        return res.status(404).json({ message: "Aucune série trouvée avec cet ID." });
      }
      res.json({ message: "Détails de la série récupérés avec succès.", data: seriesWithEpisodes });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des détails.", error: error.message });
    }
  });


  // --- NOUVELLE ROUTE POST POUR LA CRÉATION ---

  /**
   * @route   POST /api/series
   * @desc    Créer une nouvelle série avec ses saisons et épisodes
   * @access  Privé (auth)
   */
  app.post("/api/series", auth, async (req, res) => {
    try {
      const { seasons, cast, ...seriesData } = req.body;

      const formattedCast = await Promise.all(
        (cast || []).map(async (actorData) => {
          // Recherche si l'acteur existe déjà
          let actorDoc = await Actor.findOne({
            firstName: actorData.firstName,
            lastName: actorData.lastName,
          });

          // S'il n'existe pas, on le crée
          if (!actorDoc) {
            actorDoc = new Actor({
              firstName: actorData.firstName,
              lastName: actorData.lastName,
              photo: actorData.photo,
            });
            await actorDoc.save();
          }

          // On retourne l'objet formaté pour le schéma Series
          return {
            actor: actorDoc._id, // On utilise l'ID de l'acteur
            character: actorData.character,
            order: actorData.order,
          };
        })
      );
      // 1. Créer la série sans les épisodes
      const newSeries = new Series({
        ...seriesData,
        cast: formattedCast,
        contentType: 'Serie',
        seasons: []
      });
      const savedSeries = await newSeries.save();

      // 2. Créer les épisodes et construire les saisons
      let processedSeasons = [];
      for (const season of seasons) {
        let episodeIds = [];
        for (const episode of season.episodes) {
          const newEpisode = new Episode({
            ...episode,
            series: savedSeries._id,
            seasonNumber: season.seasonNumber
          });
          const savedEpisode = await newEpisode.save();
          episodeIds.push(savedEpisode._id);
        }
        processedSeasons.push({
          seasonNumber: season.seasonNumber,
          episodes: episodeIds
        });
      }

      // 3. Mettre à jour la série avec les saisons
      savedSeries.seasons = processedSeasons;
      const finalSeries = await savedSeries.save();

      res.status(201).json({ message: "Série créée avec succès!", data: finalSeries });
    } catch (error) {
      console.error("Erreur POST /api/series :", error);
      res.status(500).json({ message: "Erreur lors de la création de la série.", error: error.message });
    }
  });

  
};