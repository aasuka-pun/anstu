import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getTVDetails, getTVSeason, getMovieDetails } from '../services/tmdb'
import './Watch.css'

// Defined embed URL resolvers for all your providers
const SERVERS = [
  { 
    name: 'VidSrc.mov', 
    recommended: true, 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://vidsrc.mov/embed/tv/${id}/${s}/${e}` : `https://vidsrc.mov/embed/movie/${id}` 
  },
  { 
    name: 'VidLink', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidlink.pro/movie/${id}` 
  },
  { 
    name: 'VidFast', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://vidfast.pro/embed/tv/${id}/${s}/${e}` : `https://vidfast.pro/embed/movie/${id}` 
  },
  { 
    name: 'Videasy', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://player.videasy.net/tv/${id}/${s}/${e}` : `https://player.videasy.net/movie/${id}`
  },
  { 
    name: '111Movies', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://111movies.com/embed/tv/${id}/${s}/${e}` : `https://111movies.com/embed/movie/${id}` 
  },
  { 
    name: 'VidSrc.fyi', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://vidsrc.fyi/embed/tv/${id}/${s}/${e}` : `https://vidsrc.fyi/embed/movie/${id}` 
  },
  { 
    name: '2Embed', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` 
  },
  { 
    name: 'MultiEmbed', 
    getUrl: (type, id, s, e) => type === 'tv' ? `https://multiembed.mov/directstream.php?video_id=${id}&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}` 
  }
]

// Inside your Watch component...
function Watch() {
  // ... your existing state and effect hooks ...

  // Find active server URL at top of component render scope
  const activeServer = SERVERS.find((s) => s.name === selectedServer) || SERVERS[0]
  const mediaType = isTV ? 'tv' : 'movie'
  const embedUrl = activeServer.getUrl(mediaType, id, selectedSeason, selectedEpisode)

  return (
    <main className="watch-page">
      {/* ... your selection sections ... */}

      {/* ACTIVE PLAYER SECTION */}
      {showPlayer && (!isTV || (selectedSeason && selectedEpisode)) && (
        <section className="player-section">
          <div className="player-header">
            {isTV ? (
              <h2>
                Season {selectedSeason} • Episode {selectedEpisode}
              </h2>
            ) : (
              <h2>{title}</h2>
            )}

            <p>
              Server: <strong>{selectedServer}</strong>
            </p>
          </div>

          <div className="video-container">
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`${title} Player`}
              width="100%"
              height="100%"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              // Essential permissions for player streaming without opening popup ads
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default Watch