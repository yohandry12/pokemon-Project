const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

module.exports = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const message =
      "Vous devez fournir un token JWT dans l'en-tête Authorization.";
    return res.status(401).json({ message });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const userId = decodedToken?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Token JWT invalide ou corrompu." });
    }
    req.user = { _id: userId, isAdmin: decodedToken.isAdmin === true };
    next();
  } catch (error) {
    const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
    return res.status(401).json({ message });
  }
};
