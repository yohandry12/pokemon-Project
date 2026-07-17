const Watchlist = require("../models/watchlist.model");
const Content = require("../models/content.model");
const Serie = require("../models/series.model");
const ApiError = require("../utils/ApiError");

const findOrCreateWatchlist = async (userId) => {
  let watchlist = await Watchlist.findOne({ user: userId });
  if (!watchlist) {
    watchlist = new Watchlist({
      user: userId,
      name: "Ma liste",
      contents: [],
      series: [],
    });
  }
  return watchlist;
};

const getFavorites = async (userId) => {
  const watchlist = await findOrCreateWatchlist(userId);
  if (watchlist.isNew) await watchlist.save();
  await watchlist.populate("contents.content");
  await watchlist.populate("series.serie");
  return watchlist;
};

const addFavorite = async (userId, { contentId, seriesId }) => {
  let content = null;
  let serie = null;
  if (contentId) {
    content = await Content.findById(contentId);
    if (!content) throw new ApiError(404, "Film non trouvé");
  }
  if (seriesId) {
    serie = await Serie.findById(seriesId);
    if (!serie) throw new ApiError(404, "Série non trouvée");
  }
  if (!content && !serie) {
    throw new ApiError(400, "Aucun identifiant fourni");
  }

  const watchlist = await findOrCreateWatchlist(userId);

  if (content) {
    const existingContent = watchlist.contents.find(
      (item) => item.content.toString() === contentId
    );
    if (existingContent) {
      throw new ApiError(400, "Ce film est déjà dans vos favoris");
    }
    watchlist.contents.push({ content: contentId, addedAt: new Date() });
  }
  if (serie) {
    const existingSerie = watchlist.series.find(
      (item) => item.serie.toString() === seriesId
    );
    if (existingSerie) {
      throw new ApiError(400, "Cette série est déjà dans vos favoris");
    }
    watchlist.series.push({ serie: seriesId, addedAt: new Date() });
  }

  await watchlist.save();
  await watchlist.populate("contents.content");
  await watchlist.populate("series.serie");
  return watchlist;
};

const removeFavorite = async (userId, contentId, type) => {
  const watchlist = await Watchlist.findOne({ user: userId });
  if (!watchlist) {
    throw new ApiError(404, "Liste de favoris non trouvée");
  }

  if (type === "series") {
    watchlist.series = watchlist.series.filter(
      (item) => item.serie.toString() !== contentId
    );
  } else {
    watchlist.contents = watchlist.contents.filter(
      (item) => item.content.toString() !== contentId
    );
  }

  await watchlist.save();
  await watchlist.populate("contents.content");
  await watchlist.populate("series.serie");
  return watchlist;
};

module.exports = { getFavorites, addFavorite, removeFavorite };
