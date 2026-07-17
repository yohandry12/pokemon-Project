const ApiError = require("../utils/ApiError");

// Handler d'erreurs centralisé : les controllers appellent next(err),
// les ApiError gardent leur statut, le reste tombe en 500.
module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, ...(err.payload || {}) });
  }
  console.error(err);
  res.status(500).json({ message: err.message });
};
