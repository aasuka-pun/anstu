// src/services/providers.js

export const PROVIDERS = [
  { 
    id: '2embed',
    name: '2Embed', 
    recommended: true, 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}` 
        : `https://www.2embed.cc/embed/${tmdbId}` 
  },
  { 
    id: 'vidsrc-mov',
    name: 'VidSrc.mov', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.mov/embed/movie/${tmdbId}` 
  },
  { 
    id: 'vidsrc-xyz',
    name: 'VidSrc.xyz', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.xyz/embed/movie/${tmdbId}` 
  },
  { 
    id: 'vidfast',
    name: 'VidFast', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidfast.pro/movie/${tmdbId}` 
  },
  { 
    id: 'vidlove',
    name: 'VidLove', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidlove.pro/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidlove.pro/movie/${tmdbId}` 
  },
  { 
    id: 'vidup',
    name: 'VidUp', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidup.pro/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidup.pro/movie/${tmdbId}` 
  }
]