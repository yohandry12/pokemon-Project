const tmdbService = require("../services/tmdb.service");

const search = async (req, res, next) => {
  try {
    const results = await tmdbService.search(req.query.type, req.query.query);
    res.json({ results });
  } catch (err) {
    next(err);
  }
};

const details = async (req, res, next) => {
  try {
    const data = await tmdbService.details(req.params.type, req.params.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = { search, details };
