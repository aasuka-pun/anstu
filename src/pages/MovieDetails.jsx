import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieDetails } from '../services/tmdb'
import './MovieDetails.css'

function MovieDetails() {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await getMovieDetails(id)
        setMovie(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load movie.')
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id])

  if (loading) {
    return (
      <div className="page-message">
        Loading movie...
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="page-message">
        {error || 'Movie not found.'}
      </div>
    )
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  return (
    <main
      className="movie-details"
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
      <div className="movie-details-content">

        <Link to="/" className="back-button">
          ← Back
        </Link>

        <div className="movie-details-main">

          {posterUrl && (
            <img
              className="details-poster"
              src={posterUrl}
              alt={movie.title}
            />
          )}

          <div className="details-info">

            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="tagline">
                {movie.tagline}
              </p>
            )}

            <div className="movie-meta">
              <span>
                {movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : 'Unknown'}
              </span>

              <span>
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

              {movie.runtime > 0 && (
                <span>
                  {movie.runtime} min
                </span>
              )}
            </div>

            <div className="genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id}>
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="overview">
              {movie.overview}
            </p>

            <button className="watch-button">
              ▶ Watch Movie
            </button>

          </div>

        </div>
      </div>
    </main>
  )
}

export default MovieDetails