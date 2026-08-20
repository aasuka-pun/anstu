import { Link } from 'react-router-dom'

function MovieCard({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card-link"
    >
      <div className="movie-card">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title || movie.name}
          />
        ) : (
          <div className="no-poster">
            No Poster
          </div>
        )}

        <div className="movie-info">
          <h3>
            {movie.title || movie.name}
          </h3>

          <p>
            {(movie.release_date || movie.first_air_date)
              ? (
                  movie.release_date ||
                  movie.first_air_date
                ).slice(0, 4)
              : 'Unknown year'}
          </p>
        </div>

      </div>
    </Link>
  )
}

export default MovieCard