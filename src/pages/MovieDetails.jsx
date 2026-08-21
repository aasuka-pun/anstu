import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
} from '../services/tmdb'
import MovieRow from '../components/MovieRow'

import './MovieDetails.css'

function formatLanguage(code) {
  if (!code) return null

  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code)
  } catch {
    return code.toUpperCase()
  }
}

function formatRuntime(minutes) {
  if (!minutes) return null

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [trailer, setTrailer] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCancelled = false

    const loadMovie = async () => {
      setLoading(true)
      setError(null)

      try {
        const [details, credits, videos, similar] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
          getSimilarMovies(id),
        ])

        if (isCancelled) return

        setMovie(details)
        setCast(credits.cast?.slice(0, 15) || [])

        const officialTrailer =
          videos.results?.find(
            (video) =>
              video.site === 'YouTube' &&
              video.type === 'Trailer' &&
              video.official
          ) ||
          videos.results?.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          )

        setTrailer(officialTrailer || null)

        setSimilarMovies(
          similar.results?.filter((item) => item.poster_path) || []
        )
      } catch (err) {
        console.error(err)
        if (!isCancelled) {
          setError('Unable to load this movie.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => {
      isCancelled = true
    }
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
      <div className="page-message page-message-column">
        <p>{error || 'Movie not found.'}</p>
        <Link to="/" className="back-home-button">
          Back to Home
        </Link>
      </div>
    )
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  const year = movie.release_date ? movie.release_date.slice(0, 4) : null
  const runtime = formatRuntime(movie.runtime)
  const language = formatLanguage(movie.original_language)

  return (
    <main className="movie-details">

      <section
        className="details-hero"
        style={{
          backgroundImage: backdropUrl
            ? `linear-gradient(
                to top,
                #0b0b0f 0%,
                rgba(11, 11, 15, 0.6) 40%,
                rgba(11, 11, 15, 0.85) 100%
              ),
              linear-gradient(
                90deg,
                #0b0b0f 5%,
                rgba(11, 11, 15, 0.75) 35%,
                rgba(11, 11, 15, 0.25) 100%
              ),
              url(${backdropUrl})`
            : undefined,
        }}
      >
        <div className="details-hero-content">

          <Link to="/" className="back-button">
            ← Back
          </Link>

          <div className="movie-details-main">

            {posterUrl ? (
              <img
                className="details-poster"
                src={posterUrl}
                alt={movie.title}
              />
            ) : (
              <div className="details-poster details-poster-fallback">
                No Poster
              </div>
            )}

            <div className="details-info">

              <h1>{movie.title}</h1>

              {movie.tagline && (
                <p className="tagline">
                  {movie.tagline}
                </p>
              )}

              <div className="movie-meta">
                {year && <span>{year}</span>}

                {typeof movie.vote_average === 'number' &&
                  movie.vote_average > 0 && (
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  )}

                {runtime && <span>{runtime}</span>}

                {language && <span>{language}</span>}

                {typeof movie.popularity === 'number' && (
                  <span>Popularity {Math.round(movie.popularity)}</span>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id}>{genre.name}</span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <p className="overview">{movie.overview}</p>
              )}

              <div className="action-buttons">
                <button
                  type="button"
                  className="watch-button"
                  onClick={() => navigate(`/watch/movie/${id}`)}
                >
                  ▶ Watch Now
                </button>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trailer-button"
                  >
                    🎬 Watch Trailer
                  </a>
                )}
                
              </div>

            </div>

          </div>

        </div>
      </section>

      <div className="details-body">

        {cast.length > 0 && (
          <section className="cast-section">
            <h2>Cast</h2>

            <div className="cast-grid">
              {cast.map((member) => {
                const photoUrl = member.profile_path
                  ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                  : null

                return (
                  <div className="cast-card" key={member.id}>
                    {photoUrl ? (
                      <img
                        className="cast-photo"
                        src={photoUrl}
                        alt={member.name}
                      />
                    ) : (
                      <div className="cast-photo cast-no-photo">
                        No Photo
                      </div>
                    )}

                    <p className="cast-name">{member.name}</p>

                    {member.character && (
                      <p className="cast-character">{member.character}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {similarMovies.length > 0 && (
          <section className="similar-section">
            <MovieRow title="Similar Movies" movies={similarMovies} />
          </section>
        )}

      </div>

    </main>
  )
}

export default MovieDetails