const Rating = require("../models/rating.model");
const ApiError = require("../utils/ApiError");

const listByContent = (contentId) =>
  Rating.find({ content: contentId, isPublic: true })
    .populate("user", "firstName lastName avatar")
    .sort({ createdAt: -1 });

// Ajoute ou met à jour l'évaluation d'un utilisateur pour un contenu
const upsert = async (userId, contentId, { rating, review }) => {
  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Note invalide (1 à 5)");
  }
  let existingRating = await Rating.findOne({ user: userId, content: contentId });
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
    await existingRating.save();
    return existingRating;
  }
  return Rating.create({ user: userId, content: contentId, rating, review });
};

const remove = (userId, contentId) =>
  Rating.deleteOne({ user: userId, content: contentId });

module.exports = { listByContent, upsert, remove };
