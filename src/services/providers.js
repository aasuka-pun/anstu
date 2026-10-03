// src/services/providers.js

export const PROVIDERS = [
  { 
    id: 'vidsrc-mov',
    name: 'VidSrc.mov', 
    recommended: true, 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.mov/embed/movie/${tmdbId}` 
  },
  { 
    id: 'vidsrc-fyi',
    name: 'VidSrc.fyi', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.fyi/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.fyi/embed/movie/${tmdbId}` 
  },
  { 
    id: '2embed',
    name: '2Embed', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}` 
        : `https://www.2embed.cc/embed/${tmdbId}` 
  }
]