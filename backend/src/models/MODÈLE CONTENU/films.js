const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    // Informations de base
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    originalTitle: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["movie"],
      required: true,
    },

    // Description
    synopsis: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    description: {
      type: String,
      maxLength: 5000,
    },

    // Métadonnées
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // en minutes pour les films
      required: function () {
        if (this.type === "movie") {
          return true;
        }else if (this.type === "series") {
          return true;
        }
        return false;
      },
      
    },

    // Classification
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
      },    
    ],
    rating: {
      type: String,
      enum: ["G", "PG", "PG-13", "R", "NC-17"], 
      required: true,
    },

    // Médias
    poster: {
      type: String, // URL de l'affiche
      required: true,
    },
    backdrop: {
      type: String, // Image de fond
      required: true,
    },
    trailer: {
      type: String, // URL de la bande-annonce
      required: false,
    },
    videoUrl: {
      type: String, // URL de la vidéo du film
      required: true,
    },

    // Production
    director: {
      type: String,
      required: true,
    },
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
    producers: [String],
    writers: [String],
    studio: {
      type: String,
      required: true,
    },

    // Données techniques
    languages: [
      {
        code: String, // 'fr', 'en', etc.
        name: String,
      },
    ],
    subtitles: [
      {
        language: String,
        url: String,
      },
    ],

    // Statut et visibilité
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Statistiques
    views: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
// Export the model
module.exports = mongoose.model("Content", ContentSchema);
