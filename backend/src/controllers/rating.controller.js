const ratingService = require("../services/rating.service");

const list = async (req, res, next) => {
  try {
    const ratings = await ratingService.listByContent(req.params.contentId);
    res.json({ data: ratings });
  } catch (err) {
    next(err);
  }
};

const upsert = async (req, res, next) => {
  try {
    const saved = await ratingService.upsert(
      req.user._id,
      req.params.contentId,
      req.body
    );
    res.json({ message: "Évaluation enregistrée", data: saved });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await ratingService.remove(req.user._id, req.params.contentId);
    res.json({ message: "Évaluation supprimée" });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, upsert, remove };
