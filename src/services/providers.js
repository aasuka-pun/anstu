// src/services/providers.js

export const PROVIDERS = [
  { 
    id: 'vidsrc-mov',
    name: 'VidSrc.mov', 
    recommended: true, 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.mov/embed/tv/${tmdbId}/${season}/${episode}?ds_lang=ko&sub_lang=en` 
        : `https://vidsrc.mov/embed/movie/${tmdbId}?ds_lang=ko&sub_lang=en` 
  },
  { 
    id: 'vidsrc-fyi',
    name: 'VidSrc.fyi', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.fyi/embed/tv/${tmdbId}/${season}/${episode}?ds_lang=ko&sub_lang=en` 
        : `https://vidsrc.fyi/embed/movie/${tmdbId}?ds_lang=ko&sub_lang=en` 
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