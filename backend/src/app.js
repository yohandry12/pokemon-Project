const express = require("express");
const cors = require("cors");
const { corsOrigin } = require("./config/env");
const apiRoutes = require("./routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: corsOrigin,
  optionsSuccessStatus: 200, // Pour les navigateurs qui ne supportent pas le statut 200
};
app.use(cors(corsOptions));

app.use("/api", apiRoutes);
app.use(userRoutes); // PUT /profile — chemin historique sans préfixe /api

app.use(errorHandler);

module.exports = app;
