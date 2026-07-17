const adminStatsService = require("../services/adminStats.service");

const getStats = async (req, res, next) => {
  try {
    const stats = await adminStatsService.getStats();
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
