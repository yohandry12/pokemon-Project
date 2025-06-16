const auth = require("../src/auth/auth");
const { Pokemon } = require("../src/db/sequelize");

module.exports = (app) => {
  app.delete("/api/pokemons/:id", auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then((pokemon) => {
        if (pokemon === null) {
          const message = `Le pokémon demandé n'existe pas.`;
          return res.status(404).json({ message });
        }

        return Pokemon.destroy({
          where: { id: req.params.id },
        }).then(() => {
          const message = `Le pokémon avec l'identifiant n°${req.params.id} a bien été supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message =
          "Le pokémon n'a pas pu être supprimé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
};
