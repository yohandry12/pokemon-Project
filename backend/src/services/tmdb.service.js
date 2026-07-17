const { tmdbApiKey } = require("../config/env");
const ApiError = require("../utils/ApiError");

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

// Genres TMDB (ids films + séries) → slugs de notre collection Genre
const TMDB_GENRE_TO_SLUG = {
  28: "action",
  12: "adventure",
  16: "animation",
  35: "comedy",
  80: "thriller", // Crime : pas d'équivalent exact chez nous
  99: "documentary",
  18: "drama",
  10751: "family",
  14: "fantasy",
  36: "history",
  27: "horror",
  10402: "music",
  9648: "mystery",
  10749: "romance",
  878: "sci-fi",
  10770: "drama", // Téléfilm
  53: "thriller",
  10752: "war",
  37: "western",
  // Genres spécifiques aux séries TV
  10759: "action", // Action & Adventure
  10762: "family", // Kids
  10763: "news",
  10764: "reality-tv",
  10765: "sci-fi", // Sci-Fi & Fantasy
  10766: "drama", // Soap
  10767: "talk-show",
  10768: "war", // War & Politics
};

const img = (path, size) => (path ? `${IMG_BASE}/${size}${path}` : "");

// "Ryan Gosling" → { firstName: "Ryan", lastName: "Gosling" }
const splitName = (fullName) => {
  const parts = (fullName || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || parts[0] || "",
  };
};

const mapGenres = (genres) => [
  ...new Set(
    (genres || [])
      .map((g) => TMDB_GENRE_TO_SLUG[g.id])
      .filter(Boolean)
  ),
];

const mapCast = (credits) =>
  (credits?.cast || []).slice(0, 6).map((c, i) => ({
    ...splitName(c.name),
    character: c.character || "",
    order: i + 1,
    photo: img(c.profile_path, "w185"),
  }));

// Bande-annonce YouTube : priorité aux Trailers, sinon Teaser
const findTrailer = (videos) => {
  const list = (videos?.results || []).filter((v) => v.site === "YouTube");
  const video =
    list.find((v) => v.type === "Trailer") ||
    list.find((v) => v.type === "Teaser");
  return video ? `https://www.youtube.com/watch?v=${video.key}` : "";
};

const tmdbFetch = async (path, params = {}) => {
  if (!tmdbApiKey) {
    throw new ApiError(
      503,
      "Clé TMDB absente. Ajoutez TMDB_API_KEY dans backend/.env (compte gratuit sur themoviedb.org)."
    );
  }
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("language", "fr-FR");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  // Clé v4 (JWT "eyJ...") → header Bearer ; clé v3 → paramètre api_key
  const headers = { Accept: "application/json" };
  if (tmdbApiKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${tmdbApiKey}`;
  } else {
    url.searchParams.set("api_key", tmdbApiKey);
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError(502, "Clé TMDB invalide ou expirée.");
    }
    if (response.status === 404) {
      throw new ApiError(404, "Contenu introuvable sur TMDB.");
    }
    throw new ApiError(502, `Erreur TMDB (${response.status}).`);
  }
  return response.json();
};

const VALID_TYPES = ["movie", "tv"];

const assertType = (type) => {
  if (!VALID_TYPES.includes(type)) {
    throw new ApiError(400, "Type invalide : attendu 'movie' ou 'tv'.");
  }
};

const search = async (type, query) => {
  assertType(type);
  if (!query || query.trim().length < 2) {
    throw new ApiError(400, "La recherche doit contenir au moins 2 caractères.");
  }
  const data = await tmdbFetch(`/search/${type}`, {
    query: query.trim(),
    include_adult: "false",
  });
  return (data.results || []).slice(0, 10).map((r) => ({
    tmdbId: r.id,
    title: r.title || r.name,
    originalTitle: r.original_title || r.original_name,
    year: (r.release_date || r.first_air_date || "").slice(0, 4),
    poster: img(r.poster_path, "w185"),
    overview: r.overview || "",
    voteAverage: r.vote_average,
  }));
};

// Détails formatés pour pré-remplir les formulaires de création
const details = async (type, id) => {
  assertType(type);
  const data = await tmdbFetch(`/${type}/${id}`, {
    append_to_response: "credits,videos",
    include_video_language: "fr,en,null",
  });

  if (type === "movie") {
    const director = (data.credits?.crew || []).find(
      (c) => c.job === "Director"
    );
    return {
      title: data.title || "",
      originalTitle: data.original_title || "",
      synopsis: data.overview || "",
      releaseDate: data.release_date || "",
      duration: data.runtime || "",
      genres: mapGenres(data.genres),
      poster: img(data.poster_path, "w500"),
      backdrop: img(data.backdrop_path, "original"),
      trailer: findTrailer(data.videos),
      director: director?.name || "",
      studio: data.production_companies?.[0]?.name || "",
      cast: mapCast(data.credits),
    };
  }

  // Séries : le modèle n'a ni genres ni durée.
  // On récupère les saisons + épisodes (un appel TMDB par saison, en parallèle).
  // La saison 0 = « Spéciaux » chez TMDB, on l'ignore.
  const seasonNumbers = (data.seasons || [])
    .map((s) => s.season_number)
    .filter((n) => n > 0);

  const seasons = await Promise.all(
    seasonNumbers.map(async (n) => {
      const seasonData = await tmdbFetch(`/${type}/${id}/season/${n}`);
      return {
        seasonNumber: n,
        episodes: (seasonData.episodes || []).map((ep) => ({
          episodeNumber: ep.episode_number,
          title: ep.name || `Épisode ${ep.episode_number}`,
          videoIdentifier: "", // pas de flux TMDB : à renseigner manuellement
          duration: ep.runtime || "",
          description: ep.overview || "",
        })),
      };
    })
  );

  return {
    title: data.name || "",
    description: data.overview || "",
    posterImage: img(data.poster_path, "w500"),
    releaseDate: data.first_air_date || "",
    director:
      data.created_by?.[0]?.name ||
      (data.credits?.crew || []).find((c) => c.job === "Director")?.name ||
      "",
    studio:
      data.networks?.[0]?.name || data.production_companies?.[0]?.name || "",
    cast: mapCast(data.credits),
    seasons: seasons.filter((s) => s.episodes.length > 0),
  };
};

module.exports = { search, details };
