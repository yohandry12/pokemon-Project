const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");

const sequelize = new Sequelize("pokedex", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: true,
});

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

module.exports = {
  Pokemon,
  User,
};
