const recommendationService = require("../services/recommendation.service");

const list = async (req, res) => {
  try {
    const recommendations = await recommendationService.getRecommendations(
      req.params.userId
    );
    res.json({ data: recommendations });
  } catch (err) {
    console.error("Erreur recommandations:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { list };
