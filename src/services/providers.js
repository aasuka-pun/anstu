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
    id: 'vidlink',
    name: 'VidLink', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidlink.pro/movie/${tmdbId}` 
  },
  { 
    id: 'vidfast',
    name: 'VidFast', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://vidfast.pro/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://vidfast.pro/embed/movie/${tmdbId}` 
  },
  { 
    id: 'videasy',
    name: 'Videasy', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}` 
        : `https://player.videasy.net/movie/${tmdbId}` 
  },
  { 
    id: '111movies',
    name: '111Movies', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://111movies.com/embed/tv/${tmdbId}/${season}/${episode}` 
        : `https://111movies.com/embed/movie/${tmdbId}` 
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
  },
  { 
    id: 'multiembed',
    name: 'MultiEmbed', 
    getEmbedUrl: ({ type, tmdbId, season, episode }) => 
      type === 'tv' 
        ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&s=${season}&e=${episode}` 
        : `https://multiembed.mov/directstream.php?video_id=${tmdbId}` 
  }
]