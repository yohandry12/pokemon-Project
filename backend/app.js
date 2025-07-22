const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const findAllFilmsSeries = require("./routes/findAllFilmsSeries");
const createFilm = require("./routes/createFilm");
const register = require("./routes/register");
const login = require("./routes/login");
const favorites = require("./routes/favorites");
const serieRoute = require("./routes/SerieRoute");
const multer = require("multer");
const path = require("path");
const User = require("./src/models/user");
const auth = require("./src/auth/auth");
const UserUpdate = require("./routes/UserUpdate");
const updatedContent = require("./Admin/routes/UpdateFilm");
const updateSeries = require("./Admin/routes/UpdateSeries");
const UserAdmin = require("./Admin/routes/UserAdmin");
const SubscriptionPlan = require("./routes/subscriptionController");
const saveWatchHistory = require("./routes/historiqueRoute");
const paymentRoutes = require("./routes/paymentController");
const recommendations = require("./routes/recommendations");
const evaluation = require("./routes/evaluation");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;
const corsOrigin = process.env.CORS_ORIGIN;

const corsOptions = {
  origin: corsOrigin,
  optionsSuccessStatus: 200, // Pour les navigateurs qui ne supportent pas le statut 200
};
app.use(cors(corsOptions));
mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

findAllFilmsSeries(app);
createFilm(app);
register(app);
login(app);
favorites(app);
serieRoute(app);
UserUpdate(app);
updatedContent(app);
updateSeries(app);
UserAdmin(app);
SubscriptionPlan(app);
saveWatchHistory(app);
paymentRoutes(app);
recommendations(app);
evaluation(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
