const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const sequelize = require("./src/db/sequelize");
const app = express();
const { initDb } = require("./src/db/sequelize");

// const { success, getUniqueId } = require("./Helper");
const port = 4000;

app
  .use(favicon(path.join(__dirname, "public", "favicon.ico")))
  .use(morgan("dev"))
  .use(cors())
  .use(bodyParser.json())
  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

require("./routes/findAllPokemon")(app);
require("./routes/createPokemon")(app);
require("./routes/updatePokemon")(app);
require("./routes/deletePokemon")(app);
require("./routes/findPokemonByPK")(app);
require("./routes/login")(app);
require("./routes/register")(app);

app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Essayez un autre URL";
  res.status(404).json({ message });
});
