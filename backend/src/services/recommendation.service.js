const mongoose = require("mongoose");
const WatchHistory = require("../models/watchHistory.model");
const Watchlist = require("../models/watchlist.model");
const Content = require("../models/content.model");

// Recommandations par similarité : score basé sur les genres, réalisateurs
// et acteurs les plus fréquents dans l'historique et les favoris du user.
const getRecommendations = async (userId) => {
  // 1. Historique de visionnage
  const history = await WatchHistory.find({ user: userId }).populate("content");
  // 2. Favoris
  const watchlist = await Watchlist.findOne({ user: userId })
    .populate("contents.content")
    .populate("series.serie");

  // 3. Contenus déjà vus ou favoris
  const seenContentIds = new Set(history.map((h) => h.content._id.toString()));
  if (watchlist) {
    watchlist.contents.forEach((item) =>
      seenContentIds.add(item.content._id.toString())
    );
    watchlist.series.forEach((item) =>
      seenContentIds.add(item.serie._id.toString())
    );
  }

  // 4. Fréquence des genres, réalisateurs, acteurs
  const genreCount = {};
  const directorCount = {};
  const actorCount = {};
  const addCount = (obj, key) => {
    obj[key] = (obj[key] || 0) + 1;
  };

  history.forEach((h) => {
    if (h.content.genres)
      h.content.genres.forEach((g) => addCount(genreCount, g.toString()));
    if (h.content.director) addCount(directorCount, h.content.director);
    if (h.content.cast)
      h.content.cast.forEach(
        (a) => a.actor && addCount(actorCount, a.actor.toString())
      );
  });
  if (watchlist) {
    watchlist.contents.forEach((item) => {
      if (item.content.genres)
        item.content.genres.forEach((g) => addCount(genreCount, g.toString()));
      if (item.content.director) addCount(directorCount, item.content.director);
      if (item.content.cast)
        item.content.cast.forEach(
          (a) => a.actor && addCount(actorCount, a.actor.toString())
        );
    });
    watchlist.series.forEach((item) => {
      if (item.serie.genres)
        item.serie.genres.forEach((g) => addCount(genreCount, g.toString()));
      if (item.serie.director) addCount(directorCount, item.serie.director);
      if (item.serie.cast)
        item.serie.cast.forEach(
          (a) => a.actor && addCount(actorCount, a.actor.toString())
        );
    });
  }

  // 5. Candidats non vus/non favoris
  const query = {
    _id: {
      $nin: Array.from(seenContentIds).map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
    isPublic: true,
    status: "published",
  };
  const allCandidates = await Content.find(query);

  // 6. Score de pertinence par candidat
  const scored = allCandidates.map((c) => {
    let score = 0;
    if (c.genres)
      c.genres.forEach((g) => {
        if (genreCount[g.toString()]) score += genreCount[g.toString()] * 3;
      });
    if (c.director && directorCount[c.director])
      score += directorCount[c.director] * 2;
    if (c.cast)
      c.cast.forEach((a) => {
        if (a.actor && actorCount[a.actor.toString()])
          score += actorCount[a.actor.toString()];
      });
    return { content: c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).map((s) => s.content);
};

module.exports = { getRecommendations };
