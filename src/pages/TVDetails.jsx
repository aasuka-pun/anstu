import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { getTVDetails } from '../services/tmdb'

import './TVDetails.css'

function TVDetails() {
  const { id } = useParams()

  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadShow = async () => {
      try {
        const data = await getTVDetails(id)

        setShow(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load TV show.')
      } finally {
        setLoading(false)
      }
    }

    loadShow()
  }, [id])

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

      </div>

    </main>
  )
}

export default TVDetails