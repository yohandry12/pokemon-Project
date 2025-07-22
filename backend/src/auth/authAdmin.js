const jwt = require("jsonwebtoken");
const privateKey = require("./private_key");
// const User = require("../models/user"); // Ajout de l'import du modèle User

module.exports = async (req, res, next) => {
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
      // Vérification de l'état actif de l'utilisateur
      // const user = await User.findById(userId);
      // if (!user) {
      //   return res.status(401).json({ message: "Utilisateur introuvable." });
      // }
      // if (user.isActive === false) {
      //   return res.status(403).json({
      //     message:
      //       "Votre compte est désactivé. Veuillez contacter l'administrateur.",
      //   });
      // }
      req.user = { _id: userId };
      next();
    }
  } catch (error) {
    console.log("Erreur JWT :", error); // Ajoute cette ligne
    const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`;
    return res.status(401).json({ message });
  }
};
