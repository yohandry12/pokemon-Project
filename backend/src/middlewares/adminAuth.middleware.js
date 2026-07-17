// Pour l'instant identique au middleware auth : l'ancien authAdmin.js ne
// vérifiait PAS le rôle admin (copie exacte de auth.js).
// TODO: exiger req.user.isAdmin === true avant d'autoriser l'accès.
module.exports = require("./auth.middleware");
