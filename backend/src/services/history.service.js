const WatchHistory = require("../models/watchHistory.model");
const ApiError = require("../utils/ApiError");

// Enregistre ou met à jour l'historique de visionnage d'un user/contenu/épisode
const saveEntry = async (userId, body) => {
  const {
    contentId, // id du film ou de la série
    episodeId, // id de l'épisode (optionnel)
    watchedDuration, // en secondes
    totalDuration, // en secondes
    progressPercentage, // 0-100
    isCompleted, // booléen
    quality, // 720p, 1080p, 4K
    device, // web, mobile, tablet, tv
  } = body;

  if (!contentId) throw new ApiError(400, "contentId requis");
  if (!totalDuration) throw new ApiError(400, "totalDuration requis");

  const query = {
    user: userId,
    content: contentId,
    ...(episodeId ? { episode: episodeId } : {}),
  };

  let history = await WatchHistory.findOne(query);
  if (history) {
    // La durée visionnée ne peut que progresser
    if (watchedDuration !== undefined && watchedDuration > history.watchedDuration) {
      history.watchedDuration = watchedDuration;
    }
    history.totalDuration = totalDuration;
    history.progressPercentage = progressPercentage ?? history.progressPercentage;
    history.isCompleted = isCompleted ?? history.isCompleted;
    history.lastWatchedAt = new Date();
    if (quality) history.quality = quality;
    if (device) history.device = device;
    await history.save();
  } else {
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
  return history;
};

const getHistory = (userId) =>
  WatchHistory.find({ user: userId })
    .populate("content")
    .populate("episode")
    .sort({ lastWatchedAt: -1 });

module.exports = { saveEntry, getHistory };
