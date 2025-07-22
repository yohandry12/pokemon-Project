// backend/scripts/seedGenres.js
const mongoose = require('mongoose');
const Genre = require("../models/MODÈLE GENRE/genre");
const genres = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Comedy", slug: "comedy" },
  { name: "Drama", slug: "drama" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Horror", slug: "horror" },
  { name: "Mystery", slug: "mystery" },
  { name: "Romance", slug: "romance" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Thriller", slug: "thriller" },
  { name: "Western", slug: "western" },
  { name: "Animation", slug: "animation" },
  { name: "Documentary", slug: "documentary" },
  { name: "Family", slug: "family" },
  { name: "History", slug: "history" },
  { name: "Music", slug: "music" },
  { name: "News", slug: "news" },
  { name: "Reality-TV", slug: "reality-tv" },
  { name: "Sport", slug: "sport" },
  { name: "Talk-Show", slug: "talk-show" },
  { name: "War", slug: "war" },
  { name: "Tout public", slug: "tout public" },
  { name: "Accord parental", slug: "accord parental" },
  { name: "Adultes uniquement", slug: "adultes uniquement" },
];
const mongoURI = "mongodb://localhost:27017/bd_handflix";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Genre.deleteMany({});
    await Genre.insertMany(genres);
    console.log('Genres insérés !');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });