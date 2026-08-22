import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import {
  getTVDetails,
  getTVSeason,
} from '../services/tmdb'

import './TVDetails.css'

function TVDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(null)
  const [season, setSeason] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(1)

  const [loading, setLoading] = useState(true)
  const [seasonLoading, setSeasonLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadShow = async () => {
      try {
        const data = await getTVDetails(id)

        setShow(data)

        if (data.number_of_seasons > 0) {
          setSelectedSeason(1)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load TV show.')
      } finally {
        setLoading(false)
      }
    }

    loadShow()
  }, [id])

  useEffect(() => {
    if (!show || !selectedSeason) return

    const loadSeason = async () => {
      setSeasonLoading(true)

      try {
        const data = await getTVSeason(
          id,
          selectedSeason
        )

        setSeason(data)
      } catch (err) {
        console.error(err)
        setSeason(null)
      } finally {
        setSeasonLoading(false)
      }
    }

    loadSeason()
  }, [id, show, selectedSeason])

  if (loading) {
    return (
      <div className="page-message">
        Loading TV show...
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="page-message">
        {error || 'TV show not found.'}
      </div>
    )
  }

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null

  return (
    <main
      className="tv-details"
      style={{
        backgroundImage: backdropUrl
          ? `linear-gradient(
              90deg,
              #0b0b0f 10%,
              rgba(11, 11, 15, 0.85),
              rgba(11, 11, 15, 0.35)
            ),
            url(${backdropUrl})`
          : undefined,
      }}
    >

      <div className="tv-details-content">

        <Link to="/tv" className="back-button">
          ← Back to TV Shows
        </Link>

        <div className="tv-details-main">

          {posterUrl && (
            <img
              className="details-poster"
              src={posterUrl}
              alt={show.name}
            />
          )}

          <div className="details-info">

            <h1>{show.name}</h1>

            {show.tagline && (
              <p className="tagline">
                {show.tagline}
              </p>
            )}

            <div className="movie-meta">

              <span>
                {show.first_air_date
                  ? show.first_air_date.slice(0, 4)
                  : 'Unknown'}
              </span>

              <span>
                ⭐ {show.vote_average?.toFixed(1)}
              </span>

              <span>
                {show.number_of_seasons} seasons
              </span>

              <span>
                {show.number_of_episodes} episodes
              </span>

            </div>

            <div className="genres">

              {show.genres?.map((genre) => (
                <span key={genre.id}>
                  {genre.name}
                </span>
              ))}

            </div>

            <p className="overview">
              {show.overview}
            </p>

          </div>

        </div>

        <section className="episodes-section">

          <div className="section-heading">
            <h2>Episodes</h2>
          </div>

          <div className="season-selector">

            {show.seasons
              ?.filter((item) => item.season_number > 0)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    selectedSeason === item.season_number
                      ? 'season-button active'
                      : 'season-button'
                  }
                  onClick={() =>
                    setSelectedSeason(item.season_number)
                  }
                >
                  Season {item.season_number}
                </button>
              ))}

          </div>

          {seasonLoading && (
            <div className="page-message">
              Loading episodes...
            </div>
          )}

          {!seasonLoading && season && (
            <div className="episode-list">

              {season.episodes?.map((episode) => (
                <button
                  key={episode.id}
                  type="button"
                  className="episode-card"
                  onClick={() =>
                    navigate(
                      `/watch/tv/${id}/${selectedSeason}/${episode.episode_number}`
                    )
                  }
                >

                  <div className="episode-number">
                    {String(
                      episode.episode_number
                    ).padStart(2, '0')}
                  </div>

                  <div className="episode-info">

                    <h3>
                      {episode.name}
                    </h3>

                    <p>
                      {episode.air_date || 'Unknown date'}
                      {' • '}
                      {episode.runtime
                        ? `${episode.runtime} min`
                        : 'Runtime unknown'}
                    </p>

                    {episode.overview && (
                      <span>
                        {episode.overview}
                      </span>
                    )}

                  </div>

                </button>
              ))}

            </div>
          )}

        </section>

      </div>

    </main>
  )
}

export default TVDetails