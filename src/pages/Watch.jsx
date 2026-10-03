import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getTVDetails, getTVSeason, getMovieDetails } from '../services/tmdb'
import './Watch.css'

// Single source of truth for embed servers
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

function Watch() {
  const { id, season: urlSeason, episode: urlEpisode } = useParams()
  const location = useLocation()
  const isTV = location.pathname.includes('/watch/tv/')

  // Component State
  const [selectedServer, setSelectedServer] = useState('VidSrc.mov')
  const [show, setShow] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [selectedSeason, setSelectedSeason] = useState(urlSeason ? Number(urlSeason) : '')
  const [selectedEpisode, setSelectedEpisode] = useState(urlEpisode ? Number(urlEpisode) : '')
  const [showPlayer, setShowPlayer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [episodeLoading, setEpisodeLoading] = useState(false)

  // Compute Active Embed URL
  const activeServer = SERVERS.find((s) => s.name === selectedServer) || SERVERS[0]
  const mediaType = isTV ? 'tv' : 'movie'
  const embedUrl = activeServer.getUrl(mediaType, id, selectedSeason, selectedEpisode)

  // Load Main Movie / TV Show Details
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      try {
        if (isTV) {
          const data = await getTVDetails(id)
          setShow(data)
          const validSeasons = (data.seasons || []).filter((season) => season.season_number > 0)
          setSeasons(validSeasons)

          if (!urlSeason && validSeasons.length > 0) {
            setSelectedSeason(validSeasons[0].season_number)
          }
        } else {
          const data = await getMovieDetails(id)
          setShow(data)
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id, isTV, urlSeason])

  // Load TV Episodes when season changes
  useEffect(() => {
    if (!isTV || !selectedSeason) return

    const loadEpisodes = async () => {
      setEpisodeLoading(true)
      setEpisodes([])
      setSelectedEpisode('')

      try {
        const data = await getTVSeason(id, selectedSeason)
        setEpisodes(data.episodes || [])

        if (urlEpisode) {
          setSelectedEpisode(Number(urlEpisode))
        } else if (data.episodes?.length > 0) {
          setSelectedEpisode(data.episodes[0].episode_number)
        }
      } catch (error) {
        console.error('Failed to load episodes:', error)
      } finally {
        setEpisodeLoading(false)
      }
    }

    loadEpisodes()
  }, [id, isTV, selectedSeason, urlEpisode])

  if (loading) return <main className="watch-page">Loading...</main>
  if (!show) return <main className="watch-page">Content not found.</main>

  const title = isTV ? show.name : show.title
  const backLink = isTV ? `/tv/${id}` : `/movie/${id}`

  return (
    <main className="watch-page">
      <Link to={backLink} className="back-link">
        ← Back to {isTV ? 'TV Show' : 'Movie'}
      </Link>

      <h1>Watch {title}</h1>

      {/* TV SEASON & EPISODE SELECTORS */}
      {isTV && (
        <>
          <section className="watch-section">
            <h2>1. Select Season</h2>
            <div className="selection-list">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  className={selectedSeason === season.season_number ? 'selection-button active' : 'selection-button'}
                  onClick={() => {
                    setSelectedSeason(season.season_number)
                    setSelectedEpisode('')
                    setShowPlayer(false)
                  }}
                >
                  Season {season.season_number}
                </button>
              ))}
            </div>
          </section>

          {selectedSeason && (
            <section className="watch-section">
              <h2>2. Select Episode</h2>
              {episodeLoading ? (
                <p>Loading episodes...</p>
              ) : (
                <div className="episode-list">
                  {episodes.map((episode) => (
                    <button
                      key={episode.id}
                      className={selectedEpisode === episode.episode_number ? 'episode-button active' : 'episode-button'}
                      onClick={() => {
                        setSelectedEpisode(episode.episode_number)
                        setShowPlayer(false)
                      }}
                    >
                      <strong>Episode {episode.episode_number}</strong>
                      <span>{episode.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* SERVER SELECTION */}
      {(!isTV || (selectedSeason && selectedEpisode)) && (
        <section className="watch-section">
          <h2>{isTV ? '3.' : '1.'} Select Server</h2>
          <div className="server-list">
            {SERVERS.map((server) => (
              <button
                key={server.name}
                className={selectedServer === server.name ? 'server-button active' : 'server-button'}
                onClick={() => {
                  setSelectedServer(server.name)
                  setShowPlayer(false)
                }}
              >
                {server.name} {server.recommended && '⭐'}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="play-button"
            onClick={() => setShowPlayer(true)}
          >
            ▶ Play
          </button>
        </section>
      )}

      {/* ACTIVE IFRAME PLAYER */}
      {showPlayer && (!isTV || (selectedSeason && selectedEpisode)) && (
        <section className="player-section">
          <div className="player-header">
            <h2>{isTV ? `Season ${selectedSeason} • Episode ${selectedEpisode}` : title}</h2>
            <p>Server: <strong>{selectedServer}</strong></p>
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
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default Watch