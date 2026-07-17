const Content = require("../models/content.model");
const Series = require("../models/series.model");
const Genre = require("../models/genre.model");
const Actor = require("../models/actor.model");
const ApiError = require("../utils/ApiError");

// Recherche films + séries par titre, format harmonisé pour le frontend
const search = async (title, limit) => {
  if (title.length < 2) {
    throw new ApiError(
      400,
      "Le terme de recherche doit contenir au moins 2 caractères."
    );
  }
  const regex = new RegExp(title, "i");
  const filmsPromise = Content.find({ title: regex })
    .limit(limit)
    .populate("genres")
    .populate("cast.actor")
    .exec();
  const seriesPromise = Series.find({ title: regex })
    .limit(limit)
    .populate("genres")
    .populate("cast.actor")
    .exec();
  const [films, series] = await Promise.all([filmsPromise, seriesPromise]);

  const filmsWithType = films.map((f) => ({ ...f.toObject(), type: "movie" }));
  const seriesWithType = series.map((s) => ({
    ...s.toObject(),
    type: "series",
    poster: s.posterImage,
    synopsis: s.description,
    duration:
      s.seasons && s.seasons.length > 0
        ? s.seasons.reduce(
            (acc, season) => acc + (season.episodes?.length || 0),
            0
          ) + " épisodes"
        : "",
    releaseDate: s.releaseDate,
    cast: s.cast || [],
  }));
  return [...filmsWithType, ...seriesWithType];
};

const listAll = () =>
  Content.find()
    .sort({ title: 1 })
    .populate("genres")
    .populate("cast.actor")
    .exec();

// Nouveautés : derniers contenus publiés
const listNew = () =>
  Content.find({ isPublic: true, status: "published" })
    .sort({ createdAt: -1 })
    .limit(10);

// Tendances : contenus les plus vus
const listTrending = () =>
  Content.find({ isPublic: true, status: "published" })
    .sort({ views: -1 })
    .limit(5);

const getById = (id) =>
  Content.findById(id).populate("genres").populate("cast.actor");

// Trouve ou crée les acteurs d'un cast, retourne le tableau formaté pour le schéma
const buildCast = async (cast) => {
  const castArray = [];
  for (const castItem of cast) {
    let actor = await Actor.findOne({
      firstName: castItem.firstName,
      lastName: castItem.lastName,
    });
    if (!actor) {
      actor = new Actor({
        firstName: castItem.firstName,
        lastName: castItem.lastName,
        birthDate: castItem.birthDate,
        nationality: castItem.nationality,
        biography: castItem.biography,
        photo: castItem.photo,
      });
      await actor.save();
    }
    castArray.push({
      actor: actor._id,
      character: castItem.character,
      order: castItem.order,
    });
  }
  return castArray;
};

const create = async (data) => {
  // Conversion des slugs de genres en ObjectId
  let genresSlugs = data.genres;
  if (!Array.isArray(genresSlugs)) {
    genresSlugs = [genresSlugs];
  }
  const genresDocs = await Genre.find({ slug: { $in: genresSlugs } });
  if (genresDocs.length !== genresSlugs.length) {
    throw new ApiError(400, "Un ou plusieurs genres sont invalides.");
  }
  data.genres = genresDocs.map((g) => g._id);

  if (data.cast && Array.isArray(data.cast)) {
    data.cast = await buildCast(data.cast);
  }

  const content = new Content(data);
  await content.save();
  return content;
};

// Accepte des ObjectId (24 hex) ou des slugs, retourne des ObjectId.
const resolveGenres = async (genres) => {
  const list = Array.isArray(genres) ? genres : [genres];
  const ids = list.filter((g) => /^[0-9a-fA-F]{24}$/.test(String(g)));
  const slugs = list.filter((g) => !/^[0-9a-fA-F]{24}$/.test(String(g)));
  if (slugs.length === 0) return ids;
  const genresDocs = await Genre.find({ slug: { $in: slugs } });
  if (genresDocs.length !== slugs.length) {
    throw new ApiError(400, "Un ou plusieurs genres sont invalides.");
  }
  return [...ids, ...genresDocs.map((g) => g._id)];
};

const update = async (contentId, body) => {
  const castData = Array.isArray(body.cast) ? body.cast : [];
  const { cast, ...otherUpdateFields } = body;

  // Le frontend envoie les genres en slugs : conversion en ObjectId
  // (create le faisait déjà, update non — cause de CastError)
  if (otherUpdateFields.genres) {
    otherUpdateFields.genres = await resolveGenres(otherUpdateFields.genres);
  }

  // Trouver/créer les acteurs du cast (upsert)
  const newCastForDB = await Promise.all(
    castData.map(async (castMember) => {
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

  const finalUpdatePayload = {
    ...otherUpdateFields,
    cast: newCastForDB.filter(Boolean),
  };

  const updatedContent = await Content.findByIdAndUpdate(
    contentId,
    { $set: finalUpdatePayload },
    { new: true, runValidators: true }
  ).populate("cast.actor");

  if (!updatedContent) {
    throw new ApiError(404, "Contenu non trouvé.");
  }
  return updatedContent;
};

module.exports = { search, listAll, listNew, listTrending, getById, create, update };
