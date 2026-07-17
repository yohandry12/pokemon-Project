const ContactMessage = require("../models/contactMessage.model");
const ApiError = require("../utils/ApiError");

const createMessage = async ({ userId, fullName, email, subject, message, topic }) => {
  if (!fullName || !email || !subject || !message) {
    throw new ApiError(400, "Champs requis manquants.");
  }
  return ContactMessage.create({
    user: userId,
    fullName,
    email,
    subject,
    message,
    topic: topic || "Support",
  });
};

const listMessages = () =>
  ContactMessage.find().sort({ createdAt: -1 }).limit(200);

const replyToMessage = async (id, reply) => {
  if (!reply || reply.trim().length === 0) {
    throw new ApiError(400, "La réponse est vide.");
  }
  const msg = await ContactMessage.findById(id);
  if (!msg) throw new ApiError(404, "Message introuvable.");
  // Ici on pourrait envoyer un email; pour l'instant, on marque comme clos et on stocke la réponse
  msg.status = "closed";
  msg.reply = reply;
  await msg.save();
  return msg;
};

module.exports = { createMessage, listMessages, replyToMessage };
