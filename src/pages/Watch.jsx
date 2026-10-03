import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { getTVDetails, getTVSeason, getMovieDetails } from '../services/tmdb'
import { PROVIDERS } from '../services/providers'
import './Watch.css'

function Watch() {
  const { id, season: urlSeason, episode: urlEpisode } = useParams()
  const location = useLocation()
  const isTV = location.pathname.includes('/watch/tv/')

  // Component State
  const [selectedProviderId, setSelectedProviderId] = useState(PROVIDERS[0].id)
  const [show, setShow] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [selectedSeason, setSelectedSeason] = useState(urlSeason ? Number(urlSeason) : '')
  const [selectedEpisode, setSelectedEpisode] = useState(urlEpisode ? Number(urlEpisode) : '')
  const [showPlayer, setShowPlayer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [episodeLoading, setEpisodeLoading] = useState(false)

  // Find Active Provider & Embed URL
  const activeProvider = PROVIDERS.find((p) => p.id === selectedProviderId) || PROVIDERS[0]
  const mediaType = isTV ? 'tv' : 'movie'
  const embedUrl = activeProvider.getEmbedUrl({
    type: mediaType,
    tmdbId: id,
    season: selectedSeason,
    episode: selectedEpisode
  })

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
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                className={selectedProviderId === provider.id ? 'server-button active' : 'server-button'}
                onClick={() => {
                  setSelectedProviderId(provider.id)
                  setShowPlayer(false)
                }}
              >
                {provider.name} {provider.recommended && '⭐'}
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
            <p>Server: <strong>{activeProvider.name}</strong></p>
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