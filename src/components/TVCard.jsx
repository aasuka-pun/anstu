import { Link } from 'react-router-dom'

function TVCard({ show }) {
  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null

  return (
    <Link
      to={`/tv/${show.id}`}
      className="movie-card-link"
    >
      <div className="movie-card">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={show.name}
          />
        ) : (
          <div className="no-poster">
            No Poster
          </div>
        )}

        <div className="movie-info">
          <h3>{show.name}</h3>

          <p>
            {show.first_air_date
              ? show.first_air_date.slice(0, 4)
              : 'Unknown year'}
          </p>
        </div>

      </div>
    </Link>
  )
}

export default TVCard