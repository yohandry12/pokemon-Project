const auth = require("../src/auth/auth");
const { Pokemon } = require("../src/db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.put("/api/pokemons/:id", auth, (req, res) => {
    const pokemonId = req.params.id;
    const pokemonData = req.body;

    Pokemon.findByPk(pokemonId)
      .then((pokemon) => {
        if (pokemon === null) {
          const message = `Le pokémon avec l'identifiant n°${pokemonId} n'existe pas.`;
          return res.status(404).json({ message });
        }

        return pokemon.update(pokemonData).then(() => {
          const message = `Le pokémon avec l'identifiant n°${pokemonId} a bien été mis à jour.`;
          res.json({ message, data: pokemon });
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          const messageError =
            "Le pokémon n'a pas pu être créé. Vérifiez les données envoyées.";
          return res.status(400).json({ messageError, data: error });
        }
        if (error instanceof UniqueConstraintError) {
          const messageError =
            "Le pokémon n'a pas pu être créé. Vérifiez que le nom est unique.";
          return res.status(400).json({ messageError, data: error });
        }
        const message =
          "Le pokémon n'a pas pu être mis à jour. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
};
