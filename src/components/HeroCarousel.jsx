import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDE_DURATION = 7000 // ms between auto-advances

function HeroCarousel({ movies, genreMap }) {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)

  // Only use movies that actually have a backdrop to show
  const slides = movies.filter((movie) => movie.backdrop_path).slice(0, 6)

  const goToNext = useCallback(() => {
    setActiveIndex((current) =>
      slides.length > 0 ? (current + 1) % slides.length : 0
    )
  }, [slides.length])

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(goToNext, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [goToNext, slides.length])

  // If the trending list itself updates (new data fetched) and the
  // current index is now out of range, snap back to the first slide
  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0)
    }
  }, [slides.length, activeIndex])

  if (slides.length === 0) {
    return null
  }

  const active = slides[activeIndex]

  const backdropUrl = `https://image.tmdb.org/t/p/original${active.backdrop_path}`
  const year = active.release_date ? active.release_date.slice(0, 4) : null

  const genreNames = (active.genre_ids || [])
    .map((genreId) => genreMap[genreId])
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section
      className="hero-carousel"
      style={{
        backgroundImage: `linear-gradient(
            to top,
            #0b0b0f 0%,
            rgba(11, 11, 15, 0.55) 45%,
            rgba(11, 11, 15, 0.15) 100%
          ),
          linear-gradient(
            90deg,
            #0b0b0f 5%,
            rgba(11, 11, 15, 0.7) 40%,
            rgba(11, 11, 15, 0.15) 100%
          ),
          url(${backdropUrl})`,
      }}
    >
      <div className="hero-carousel-content">
        <h1>{active.title}</h1>

        <div className="hero-meta">
          {typeof active.vote_average === 'number' &&
            active.vote_average > 0 && (
              <span>⭐ {active.vote_average.toFixed(1)}</span>
            )}

          {year && <span>{year}</span>}

          {genreNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>

        {active.overview && (
          <p className="hero-overview">{active.overview}</p>
        )}

        <div className="hero-buttons">
          <button
            type="button"
            className="hero-play-button"
            onClick={() => navigate(`/watch/movie/${active.id}`)}
          >
            ▶ Play
          </button>

          <button
            type="button"
            className="hero-info-button"
            onClick={() => navigate(`/movie/${active.id}`)}
          >
            ⓘ Info
          </button>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              aria-label={`Show ${movie.title}`}
              className={
                index === activeIndex ? 'hero-dot active' : 'hero-dot'
              }
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroCarousel