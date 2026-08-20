import MovieCard from './MovieCard'

function MovieRow({ title, movies }) {
  return (
    <section className="movie-row">
      <div className="movie-row-header">
        <h2>{title}</h2>
      </div>

      <div className="movie-row-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  )
}

export default MovieRow