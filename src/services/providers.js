// src/services/providers.js

export const PROVIDERS = [
  {
    id: "videasy",
    name: "Videasy",
    getEmbedUrl: ({ type, tmdbId, season, episode }) => {
      return type === "tv"
        ? `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`
        : `https://player.videasy.net/movie/${tmdbId}`;
    },
  },
  {
    id: "111movies",
    name: "111Movies",
    getEmbedUrl: ({ type, tmdbId, season, episode }) => {
      return type === "tv"
        ? `https://111movies.com/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://111movies.com/embed/movie/${tmdbId}`;
    },
  },
  {
    id: "vidsuper",
    name: "VidSuper",
    getEmbedUrl: ({ type, imdbId, tmdbId, season, episode }) => {
      const id = imdbId || tmdbId;
      return type === "tv"
        ? `https://vidsuper.org/embed/tv/${id}/${season}/${episode}`
        : `https://vidsuper.org/embed/movie/${id}`;
    },
  },
  {
    id: "vidfast",
    name: "VidFast",
    getEmbedUrl: ({ type, tmdbId, season, episode }) => {
      return type === "tv"
        ? `https://vidfast.pro/embed/tv/${tmdbId}/${season}/${episode}`
        : `https://vidfast.pro/embed/movie/${tmdbId}`;
    },
  },
];