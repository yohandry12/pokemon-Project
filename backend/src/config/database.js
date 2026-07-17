const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDatabase = () =>
  mongoose
    .connect(mongoUri, {})
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });

module.exports = connectDatabase;
