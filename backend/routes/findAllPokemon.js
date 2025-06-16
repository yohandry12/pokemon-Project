const auth = require("../src/auth/auth");
const { Pokemon } = require("../src/db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", auth, (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      const limit = req.query.limit || 5;
      if (name.length < 2) {
        const message =
          "Le terme de recherche doit contenir au moins 2 caractères.";
        return res.status(400).json({ message });
      }
      return Pokemon.findAndCountAll({
        where: { name: { [Op.like]: `%${name}%` } },
        order: ["name"],
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y'a ${count} pokémons qui correspondent au terme recherché ${name}`;
        res.json({
          message,
          data: rows,
        });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été recupérée";
          res.json({
            message,
            data: pokemons,
          });
        })
        .catch((error) => {
          const message = "La liste des pokémons n'a pas pu être récupérée";
          res.status(500).json({
            message,
            error: error.message,
          });
        });
    }
  });
};
