const { deepseekApiKey } = require("../config/env");
const ApiError = require("../utils/ApiError");

// Relaie une requête de chat completion vers DeepSeek.
// La clé API reste côté serveur (jamais exposée au client).
const chatCompletion = async ({ messages, ...options }) => {
  if (!deepseekApiKey) {
    throw new ApiError(503, "Service IA non configuré.");
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ApiError(400, "messages requis.");
  }

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${deepseekApiKey}`,
    },
    body: JSON.stringify({ model: "deepseek-chat", messages, ...options }),
  });

  const data = await response.json();
  if (!response.ok) {
    // Propage le statut DeepSeek (ex: 429 rate limit) pour que le frontend
    // garde sa gestion d'erreur existante.
    throw new ApiError(response.status, data?.error?.message || "Erreur du service IA.");
  }
  return data;
};

module.exports = { chatCompletion };
