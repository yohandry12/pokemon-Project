const mongoose = require("mongoose");
const Series = require("../models/series.model");
const Episode = require("../models/episode.model");
const Actor = require("../models/actor.model");
const ApiError = require("../utils/ApiError");

const listAll = () =>
  Series.find({ contentType: "Serie" }).populate({
    path: "cast.actor",
    model: "Actor",
  });

// Nouvelles séries : dernières créées
const listNew = () => Series.find({}).sort({ createdAt: -1 }).limit(5);

// Séries tendances : les plus vues (fallback createdAt)
const listTrending = () =>
  Series.find({}).sort({ views: -1, createdAt: -1 }).limit(5);

const getById = async (seriesId) => {
  if (!mongoose.Types.ObjectId.isValid(seriesId)) {
    throw new ApiError(400, "ID de série invalide.");
  }
  const seriesWithEpisodes = await Series.findById(seriesId)
    .populate({ path: "seasons.episodes", model: "Episode" })
    .populate({ path: "cast.actor", model: "Actor" });
  if (!seriesWithEpisodes || seriesWithEpisodes.contentType !== "Serie") {
    throw new ApiError(404, "Aucune série trouvée avec cet ID.");
  }
  return seriesWithEpisodes;
};

const create = async ({ seasons, cast, ...seriesData }) => {
  const formattedCast = await Promise.all(
    (cast || []).map(async (actorData) => {
      let actorDoc = await Actor.findOne({
        firstName: actorData.firstName,
        lastName: actorData.lastName,
      });
      if (!actorDoc) {
        actorDoc = new Actor({
          firstName: actorData.firstName,
          lastName: actorData.lastName,
          photo: actorData.photo,
        });
        await actorDoc.save();
      }
      return {
        actor: actorDoc._id,
        character: actorData.character,
        order: actorData.order,
      };
    })
  );

  // 1. Créer la série sans les épisodes
  const newSeries = new Series({
    ...seriesData,
    cast: formattedCast,
    contentType: "Serie",
    seasons: [],
  });
  const savedSeries = await newSeries.save();

  // 2. Créer les épisodes et construire les saisons
  const processedSeasons = [];
  for (const season of seasons) {
    const episodeIds = [];
    for (const episode of season.episodes) {
      const newEpisode = new Episode({
        ...episode,
        series: savedSeries._id,
        seasonNumber: season.seasonNumber,
      });
      const savedEpisode = await newEpisode.save();
      episodeIds.push(savedEpisode._id);
    }
    processedSeasons.push({
      seasonNumber: season.seasonNumber,
      episodes: episodeIds,
    });
  }

  // 3. Mettre à jour la série avec les saisons
  savedSeries.seasons = processedSeasons;
  return savedSeries.save();
};

const update = async (seriesId, { cast, seasons, ...seriesInfo }) => {
  const seriesToUpdate = await Series.findById(seriesId);
  if (!seriesToUpdate) {
    throw new ApiError(404, "Série non trouvée.");
  }

  // Champs de premier niveau
  Object.assign(seriesToUpdate, seriesInfo);

  // Casting (trouve ou crée les acteurs)
  if (Array.isArray(cast)) {
    const newCast = await Promise.all(
      cast.map(async (castMember) => {
        if (!castMember.firstName || !castMember.lastName) return null;
        const actor = await Actor.findOneAndUpdate(
          { firstName: castMember.firstName, lastName: castMember.lastName },
          { $set: { photo: castMember.photo } },
          { new: true, upsert: true }
        );
        return {
          character: castMember.character,
          order: castMember.order,
          actor: actor._id,
        };
      })
    );
    seriesToUpdate.cast = newCast.filter(Boolean);
  }

  // Saisons et épisodes référencés (update existants, crée les nouveaux)
  if (Array.isArray(seasons)) {
    const updatedSeasons = await Promise.all(
      seasons.map(async (season) => {
        const episodeIds = await Promise.all(
          season.episodes.map(async (ep) => {
            if (ep._id) {
              await Episode.findByIdAndUpdate(
                ep._id,
                {
                  title: ep.title,
                  episodeNumber: ep.episodeNumber,
                  description: ep.description,
                  duration: ep.duration,
                  videoIdentifier: ep.videoIdentifier,
                  seasonNumber: season.seasonNumber,
                },
                { new: true, runValidators: true }
              );
              return ep._id;
            }
            const newEp = new Episode({
              title: ep.title,
              episodeNumber: ep.episodeNumber,
              description: ep.description,
              duration: ep.duration,
              videoIdentifier: ep.videoIdentifier,
              seasonNumber: season.seasonNumber,
              series: seriesToUpdate._id,
            });
            const savedEp = await newEp.save();
            return savedEp._id;
          })
        );
        return { seasonNumber: season.seasonNumber, episodes: episodeIds };
      })
    );
    seriesToUpdate.seasons = updatedSeasons;
  }

  const updatedSeries = await seriesToUpdate.save();
  await updatedSeries.populate("cast.actor");
  return updatedSeries;
};

module.exports = { listAll, listNew, listTrending, getById, create, update };
