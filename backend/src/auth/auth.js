const jwt = require("jsonwebtoken");
const privateKey = require("./private_key");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const message =
      "Vous devez fournir un token JWT dans l'en-tête Authorization.";
    return res.status(401).json({ message });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, privateKey);
    console.log("Decoded Token:", decodedToken);
    const userId = decodedToken?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Token JWT invalide ou corrompu." });
    } else {
      next();
    }
  } catch (error) {
    console.log("Erreur JWT :", error); // Ajoute cette ligne
    const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
    return res.status(401).json({ message });
  }
};
