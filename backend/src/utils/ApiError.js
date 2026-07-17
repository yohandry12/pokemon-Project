// Erreur métier portant un code HTTP. Levée par les services,
// traduite en réponse JSON par les controllers ou l'errorHandler.
class ApiError extends Error {
  constructor(statusCode, message, payload) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload; // champs additionnels à inclure dans la réponse
  }
}

module.exports = ApiError;
