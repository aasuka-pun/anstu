import { Link } from 'react-router-dom'

function MovieCard({ movie }) {
  const isTV = movie.media_type === 'tv' || (!movie.title && movie.name)
  const title = movie.title || movie.name

  // Prefer a landscape backdrop image; fall back to the poster if the
  // title has no backdrop on file
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null

  return (
    <Link
      to={isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`}
      className="movie-card-link"
    >
      <div className="movie-card">

        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="no-poster">No Image</div>
        )}

        <div className="movie-card-overlay">
          <h3>{title}</h3>
        </div>

      </div>
    </Link>
  )
}

export default MovieCard