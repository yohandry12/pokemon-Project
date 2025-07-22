// models/Content.js (ou Series.js)
const mongoose = require("mongoose");

const SeasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  // On ne stocke que les références aux épisodes
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
});

const SeriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    posterImage: { type: String },
    contentType: { type: String, enum: ["Serie"], required: true },

    // Ajout des nouveaux champs pour harmonisation avec les films
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    studio: { type: String, required: true },
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Actor",
        },
        character: String,
        order: Number,
      },
    ],
    // Uniquement pour les séries
    seasons: {
      type: [SeasonSchema],
      // S'assure que ce champ n'existe que pour les séries
      default: undefined,
    },
    // ... autres champs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Series", SeriesSchema);

// Votre EpisodeSchema reste exactement le même !
// export default mongoose.model("Episode", EpisodeSchema);
