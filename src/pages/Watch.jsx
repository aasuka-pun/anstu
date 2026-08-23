import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getTVDetails, getTVSeason, getMovieDetails } from '../services/tmdb'
import './Watch.css'

const servers = [
  { name: 'VidSrc.mov', recommended: true },
  { name: 'VidSrc.fyi' },
  { name: 'VidRock' },
  { name: 'Vidnest' },
  { name: 'VidKing' },
  { name: 'VidLink' },
  { name: 'VidFast' },
  { name: 'VidUp' },
  { name: 'Videasy' },
  { name: '111Movies' },
  { name: '2Embed' },
  { name: 'MultiEmbed' },
  { name: 'SuperFlix' },
  { name: 'Peachify' },
]

function Watch() {
  const { id, season: urlSeason, episode: urlEpisode } = useParams()
  const location = useLocation()
  const isTV = location.pathname.includes('/watch/tv/')

  const [show, setShow] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [episodes, setEpisodes] = useState([])

  const [selectedSeason, setSelectedSeason] = useState(
    urlSeason ? Number(urlSeason) : ''
  )
  const [selectedEpisode, setSelectedEpisode] = useState(
    urlEpisode ? Number(urlEpisode) : ''
  )

  const [selectedServer, setSelectedServer] = useState('VidSrc.mov')
  const [showPlayer, setShowPlayer] = useState(false)

  const [loading, setLoading] = useState(true)
  const [episodeLoading, setEpisodeLoading] = useState(false)

  // Load the movie or show itself
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)

      try {
        if (isTV) {
          const data = await getTVDetails(id)
          setShow(data)

          const validSeasons = (data.seasons || []).filter(
            (season) => season.season_number > 0
          )
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

  // TV: load episodes for the selected season
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

  if (loading) {
    return <main className="watch-page">Loading...</main>
  }

  if (!show) {
    return <main className="watch-page">Content not found.</main>
  }

  const title = isTV ? show.name : show.title
  const backLink = isTV ? `/tv/${id}` : `/movie/${id}`

  return (
    <main className="watch-page">

      <Link to={backLink} className="back-link">
        ← Back to {isTV ? 'TV Show' : 'Movie'}
      </Link>

      <h1>Watch {title}</h1>

      {isTV && (
        <>
          <section className="watch-section">
            <h2>1. Select Season</h2>

            <div className="selection-list">
              {seasons.map((season) => (
                <button
                  key={season.id}
                  className={
                    selectedSeason === season.season_number
                      ? 'selection-button active'
                      : 'selection-button'
                  }
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
                      className={
                        selectedEpisode === episode.episode_number
                          ? 'episode-button active'
                          : 'episode-button'
                      }
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

      {/* SELECT SERVER */}
      {(!isTV || (selectedSeason && selectedEpisode)) && (
        <section className="watch-section">
          <h2>{isTV ? '3.' : '1.'} Select Server</h2>

          <div className="server-list">
            {servers.map((server) => (
              <button
                key={server.name}
                className={
                  selectedServer === server.name
                    ? 'server-button active'
                    : 'server-button'
                }
                onClick={() => {
                  setSelectedServer(server.name)
                  setShowPlayer(false)
                }}
              >
                {server.name}
                {server.recommended && ' ⭐'}
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

      {/* PLAYER PLACEHOLDER */}
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
            <div className="video-placeholder">
              <p className="placeholder-label">
                {isTV ? 'TV Show ID' : 'Movie ID'}
              </p>
              <p className="placeholder-id">{id}</p>

              {isTV && (
                <p className="placeholder-meta">
                  Season {selectedSeason}, Episode {selectedEpisode}
                </p>
              )}

              <p className="placeholder-meta">
                Server: {selectedServer}
              </p>
            </div>
          </div>

        </section>
      )}

    </main>
  )
}

export default Watch