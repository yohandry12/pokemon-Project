const User = require("../src/models/user");
const auth = require("../src/auth/auth");
const WatchHistory = require("../src/models/HISTORIQUE DE VISIONNAGE/historique");
const Content = require("../src/models/MODÈLE CONTENU/films");
const Episode = require("../src/models/MODÈLE ÉPISODE/Episode");

module.exports = (app) => {
  // Enregistrer ou mettre à jour l'historique de visionnage
  app.post("/api/history", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        contentId, // id du film ou de la série
        episodeId, // id de l'épisode (optionnel)
        watchedDuration, // en secondes
        totalDuration, // en secondes
        progressPercentage, // 0-100
        isCompleted, // booléen
        quality, // 720p, 1080p, 4K
        device, // web, mobile, tablet, tv
      } = req.body;

      if (!contentId) {
        return res.status(400).json({ message: "contentId requis" });
      }
      if (!totalDuration) {
        return res.status(400).json({ message: "totalDuration requis" });
      }

      // On cherche un historique existant pour ce user/contenu/épisode
      const query = {
        user: userId,
        content: contentId,
        ...(episodeId ? { episode: episodeId } : {}),
      };

      let history = await WatchHistory.findOne(query);
      if (history) {
        // Mise à jour de l'historique existant
        if (watchedDuration !== undefined && watchedDuration > history.watchedDuration) {
          history.watchedDuration = watchedDuration;
        }
        history.totalDuration = totalDuration;
        history.progressPercentage =
          progressPercentage ?? history.progressPercentage;
        history.isCompleted = isCompleted ?? history.isCompleted;
        history.lastWatchedAt = new Date();
        if (quality) history.quality = quality;
        if (device) history.device = device;
        await history.save();
      } else {
        // Création d'un nouvel historique
        history = new WatchHistory({
          user: userId,
          content: contentId,
          episode: episodeId || null,
          watchedDuration: watchedDuration || 0,
          totalDuration,
          progressPercentage: progressPercentage || 0,
          isCompleted: isCompleted || false,
          lastWatchedAt: new Date(),
          quality,
          device,
        });
        await history.save();
      }
      res.json({ message: "Historique enregistré", data: history });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/history", auth, async (req, res) => {
    try {
      const userId = req.user._id;
      // On récupère tout l'historique de l'utilisateur, trié par date décroissante
      const history = await WatchHistory.find({ user: userId })
        .populate("content") // pour avoir les infos du film/série
        .populate("episode") // pour les épisodes si besoin
        .sort({ lastWatchedAt: -1 });
      res.json({ data: history });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
