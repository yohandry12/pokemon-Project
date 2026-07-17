const historyService = require("../services/history.service");
const ApiError = require("../utils/ApiError");

const save = async (req, res, next) => {
  try {
    const history = await historyService.saveEntry(req.user._id, req.body);
    res.json({ message: "Historique enregistré", data: history });
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    res.status(500).json({ message: err.message });
  }
};

const list = async (req, res, next) => {
  try {
    const history = await historyService.getHistory(req.user._id);
    res.json({ data: history });
  } catch (err) {
    next(err);
  }
};

module.exports = { save, list };
