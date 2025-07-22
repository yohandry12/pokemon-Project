const auth = require("../../src/auth/authAdmin");
const series = require("../../src/models/MODÈLE ÉPISODE/series");
const Actor = require("../../src/models/MODÈLE ACTEUR/acteur");
const Episode = require("../../src/models/MODÈLE ÉPISODE/Episode");

module.exports = (app) => {
  app.put("/api/series/:seriesId", auth, async (req, res) => {
    const { seriesId } = req.params;
    const { cast, seasons, ...seriesInfo } = req.body; // Sépare les champs

    try {
      // Étape 1 : Trouver la série existante
      const seriesToUpdate = await series.findById(seriesId);
      if (!seriesToUpdate) {
        return res.status(404).json({ message: "Série non trouvée." });
      }

      // Étape 2 : Mettre à jour les champs de premier niveau
      // Object.assign fusionne les nouvelles informations dans l'objet existant
      Object.assign(seriesToUpdate, seriesInfo);

      // Étape 3 : Traiter et mettre à jour le casting (logique déjà correcte)
      if (Array.isArray(cast)) {
        const newCast = await Promise.all(
          cast.map(async (castMember) => {
            if (!castMember.firstName || !castMember.lastName) return null;
            const actor = await Actor.findOneAndUpdate(
              {
                firstName: castMember.firstName,
                lastName: castMember.lastName,
              },
              { $set: { photo: castMember.photo } },
              { new: true, upsert: true }
            );
            return {
              character: castMember.character,
              order: castMember.order,
              actor: actor._id,
            };
          })
        );
        seriesToUpdate.cast = newCast.filter(Boolean);
      }

      // Étape 4 (CORRECTION) : Mettre à jour les saisons et épisodes référencés
      if (Array.isArray(seasons)) {
        // Pour chaque saison, on va gérer les épisodes
        const updatedSeasons = await Promise.all(
          seasons.map(async (season) => {
            // Pour chaque épisode de la saison
            const episodeIds = await Promise.all(
              season.episodes.map(async (ep) => {
                if (ep._id) {
                  // Mise à jour d'un épisode existant
                  await Episode.findByIdAndUpdate(
                    ep._id,
                    {
                      title: ep.title,
                      episodeNumber: ep.episodeNumber,
                      description: ep.description,
                      duration: ep.duration,
                      videoIdentifier: ep.videoIdentifier,
                      seasonNumber: season.seasonNumber,
                    },
                    { new: true, runValidators: true }
                  );
                  return ep._id;
                } else {
                  // Création d'un nouvel épisode
                  const newEp = new Episode({
                    title: ep.title,
                    episodeNumber: ep.episodeNumber,
                    description: ep.description,
                    duration: ep.duration,
                    videoIdentifier: ep.videoIdentifier,
                    seasonNumber: season.seasonNumber,
                    series: seriesToUpdate._id,
                  });
                  const savedEp = await newEp.save();
                  return savedEp._id;
                }
              })
            );
            return {
              seasonNumber: season.seasonNumber,
              episodes: episodeIds,
            };
          })
        );
        seriesToUpdate.seasons = updatedSeasons;
      }

      // Étape 5 : Sauvegarder l'objet série entièrement modifié
      const updatedSeries = await seriesToUpdate.save();

      // Populate le cast pour la réponse (optionnel mais recommandé)
      await updatedSeries.populate("cast.actor");

      res.json({
        message: "Série mise à jour avec succès",
        data: updatedSeries,
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la série :", err);
      // Gérer les erreurs de validation de Mongoose
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
  });
};
