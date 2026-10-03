// src/services/providers.js

export const PROVIDERS = [
  { 
    id: '2embed',
    name: '2Embed (Original Korean)', 
    recommended: true, 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}` 
        : `https://www.2embed.cc/embed/${tmdbId}` 
  },
  { 
    id: 'superembed',
    name: 'SuperEmbed (Raw Asian Streams)', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&s=${season}&e=${episode}` 
        : `https://multiembed.mov/directstream.php?video_id=${tmdbId}` 
  },
  { 
    id: 'vidsrc-cc',
    name: 'VidSrc.cc (Subbed)', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.cc/v2/embed/movie/${tmdbId}` 
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
    id: 'vidsrc-fyi',
    name: 'VidSrc.fyi', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidsrc.fyi/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidsrc.fyi/embed/movie/${tmdbId}` 
  }
]