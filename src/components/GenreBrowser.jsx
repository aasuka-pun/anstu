import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMovieGenres,
  getTVGenres,
  discoverMoviesByGenre,
  discoverTVByGenre,
  discoverKDramas,
} from '../services/tmdb'
import './GenreBrowser.css'

function GenreBrowser({ onClose }) {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('movie') // 'movie' | 'tv' | 'kdrama'
  const [movieGenres, setMovieGenres] = useState([])
  const [tvGenres, setTvGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Load both genre lists once
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const [movies, tv] = await Promise.all([
          getMovieGenres(),
          getTVGenres(),
        ])

        setMovieGenres(movies.genres || [])
        setTvGenres(tv.genres || [])

        if (movies.genres?.length > 0) {
          setSelectedGenre(movies.genres[0].id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadGenres()
  }, [])

  // When switching tabs, default to that tab's first genre
  const switchTab = (tab) => {
    setActiveTab(tab)

    const genreList = tab === 'movie' ? movieGenres : tvGenres
    setSelectedGenre(genreList[0]?.id ?? null)
  }

  // Fetch results whenever the tab or selected genre changes
  useEffect(() => {
    if (activeTab !== 'kdrama' && !selectedGenre) return

    const loadResults = async () => {
      setLoading(true)

      try {
        let data

        if (activeTab === 'movie') {
          data = await discoverMoviesByGenre(selectedGenre)
        } else if (activeTab === 'tv') {
          data = await discoverTVByGenre(selectedGenre)
        } else {
          data = await discoverKDramas(selectedGenre)
        }

        setResults(data.results?.filter((item) => item.poster_path) || [])
      } catch (err) {
        console.error(err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [activeTab, selectedGenre])

  const genreList = activeTab === 'movie' ? movieGenres : tvGenres

  const handleSelect = (item) => {
    const isMovie = activeTab === 'movie'
    navigate(isMovie ? `/movie/${item.id}` : `/tv/${item.id}`)
    onClose()
  }

  return (
    <div className="genre-overlay" onClick={onClose}>
      <div className="genre-modal" onClick={(e) => e.stopPropagation()}>

        <div className="genre-modal-header">
          <h2>Browse by Genre</h2>

          <button
            type="button"
            className="genre-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="genre-type-tabs">
          <button
            type="button"
            className={activeTab === 'movie' ? 'type-tab active' : 'type-tab'}
            onClick={() => switchTab('movie')}
          >
            Movies
          </button>

          <button
            type="button"
            className={activeTab === 'tv' ? 'type-tab active' : 'type-tab'}
            onClick={() => switchTab('tv')}
          >
            TV Shows
          </button>

          <button
            type="button"
            className={
              activeTab === 'kdrama' ? 'type-tab active' : 'type-tab'
            }
            onClick={() => switchTab('kdrama')}
          >
            K-Dramas
          </button>
        </div>

        {activeTab !== 'kdrama' && (
          <div className="genre-pill-row">
            {genreList.map((genre) => (
              <button
                key={genre.id}
                type="button"
                className={
                  selectedGenre === genre.id
                    ? 'genre-pill active'
                    : 'genre-pill'
                }
                onClick={() => setSelectedGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}

        <div className="genre-results">
          {loading ? (
            <p className="genre-loading">Loading...</p>
          ) : results.length === 0 ? (
            <p className="genre-loading">No results found.</p>
          ) : (
            <div className="genre-grid">
              {results.map((item) => {
                const title = item.title || item.name
                const date = item.release_date || item.first_air_date
                const posterUrl = `https://image.tmdb.org/t/p/w342${item.poster_path}`

                return (
                  <button
                    type="button"
                    key={item.id}
                    className="genre-card"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="genre-poster-wrap">
                      <img src={posterUrl} alt={title} />

                      {typeof item.vote_average === 'number' &&
                        item.vote_average > 0 && (
                          <span className="genre-rating">
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                    </div>

                    <p className="genre-card-title">{title}</p>
                    <p className="genre-card-year">
                      {date ? date.slice(0, 4) : ''}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default GenreBrowser