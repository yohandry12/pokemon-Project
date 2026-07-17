const contactService = require("../services/contact.service");

const create = async (req, res, next) => {
  try {
    const { fullName, email, subject, message, topic } = req.body || {};
    const saved = await contactService.createMessage({
      userId: req.user && req.user._id ? req.user._id : undefined,
      fullName,
      email,
      subject,
      message,
      topic,
    });
    return res.status(201).json({ message: "Message reçu.", data: saved });
  } catch (err) {
    next(err);
  }
};

const list = async (_req, res, next) => {
  try {
    const items = await contactService.listMessages();
    return res.json({ data: items });
  } catch (err) {
    next(err);
  }
};

const reply = async (req, res, next) => {
  try {
    const msg = await contactService.replyToMessage(req.params.id, (req.body || {}).reply);
    return res.json({ message: "Réponse enregistrée.", data: msg });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, reply };
