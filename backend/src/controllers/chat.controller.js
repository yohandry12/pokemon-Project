const chatService = require("../services/chat.service");

const completion = async (req, res, next) => {
  try {
    const data = await chatService.chatCompletion(req.body || {});
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { completion };
