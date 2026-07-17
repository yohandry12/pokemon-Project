const mongoose = require('mongoose');

/**
 * Schéma Mongoose pour un document "Episode".
 * Chaque épisode est un document distinct dans sa propre collection.
 */
const EpisodeSchema = new mongoose.Schema({
    // Référence à la série parente (le document 'Content').
    // C'est le lien essentiel qui connecte un épisode à sa série.
    series: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content', // Le nom du modèle Mongoose pour les contenus (films/séries).
        required: true,
        index: true // Un index accélère les recherches d'épisodes pour une série donnée.
    },

    // Le titre de l'épisode (ex: "L'Hiver vient").
    title: {
        type: String,
        required: [true, "Le titre de l'épisode est requis."],
        trim: true
    },

    // Le numéro de la saison à laquelle cet épisode appartient.
    seasonNumber: {
        type: Number,
        required: [true, "Le numéro de saison est requis."],
    },
    
    // Le numéro de l'épisode dans l'ordre de la saison.
    episodeNumber: {
        type: Number,
        required: [true, "Le numéro d'épisode est requis."],
    },

    // L'identifiant utilisé pour trouver et streamer le fichier vidéo.
    // Cela peut être un nom de fichier (ex: "got_s01e01.mp4"), une URL, ou un ID de service cloud.
    videoIdentifier: {
        type: String,
        required: [true, "L'identifiant de la vidéo est requis."],
    },

    // La durée de l'épisode, stockée en minutes.
    duration: {
        type: Number,
        required: [true, "La durée est requise."],
    },
    
    // Une description ou un synopsis optionnel pour l'épisode.
    description: {
        type: String,
        trim: true
    },
    
    // URL d'une miniature ("thumbnail") pour l'épisode, affichée dans la liste.
    thumbnail: {
        type: String,
    }

}, {
    // Ajoute automatiquement les champs `createdAt` et `updatedAt` pour chaque épisode.
    timestamps: true
});

// Création d'un index composé.
// Cela garantit qu'il ne peut y avoir deux épisodes avec le même numéro,
// dans la même saison de la même série.
EpisodeSchema.index({ series: 1, seasonNumber: 1, episodeNumber: 1 }, { unique: true });

// Exporte le modèle pour qu'il puisse être utilisé dans d'autres fichiers (comme vos routes).
module.exports = mongoose.model('Episode', EpisodeSchema);
