import { useRef } from 'react'
import MovieCard from './MovieCard'

function MovieRow({ title, movies }) {
  const scrollRef = useRef(null)

  const scrollByAmount = (direction) => {
    const container = scrollRef.current
    if (!container) return

    // Scroll roughly one screenful of cards at a time
    const amount = container.clientWidth * 0.85

    container.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="movie-row">
      <div className="movie-row-header">
        <h2>{title}</h2>
      </div>

      <div className="movie-row-wrapper">
        <button
          type="button"
          className="row-arrow row-arrow-prev"
          onClick={() => scrollByAmount('prev')}
          aria-label={`Scroll ${title} left`}
        >
          ‹
        </button>

        <div className="movie-row-list" ref={scrollRef}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>

        <button
          type="button"
          className="row-arrow row-arrow-next"
          onClick={() => scrollByAmount('next')}
          aria-label={`Scroll ${title} right`}
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default MovieRow