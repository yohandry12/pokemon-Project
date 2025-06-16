const auth = require("../src/auth/auth");
const { Pokemon } = require("../src/db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/create/pokemons", auth, (req, res) => {
    const pokemon = req.body;
    Pokemon.create(pokemon)
      .then((pokemon) => {
        const message = `Le pokémon ${req.body.name} a bien été créé.`;
        res.json({ message, data: pokemon });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          const messageError =
            "Le pokémon n'a pas pu être créé. Vérifiez les données envoyées.";
          return res.status(400).json({ message: messageError, data: error });
        }
        if (error instanceof UniqueConstraintError) {
          const messageName =
            "Le pokémon n'a pas pu être créé. Vérifiez que le nom est unique.";
          return res.status(400).json({ message: messageName, data: error });
        }
        const message =
          "Le pokémon n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
};
