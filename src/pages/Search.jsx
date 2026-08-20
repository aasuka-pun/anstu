import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

import { searchMulti } from '../services/tmdb'

import './Search.css'

function SearchResultCard({ item }) {
  const title = item.title || item.name
  const date = item.release_date || item.first_air_date
  const linkTo =
    item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
  const imageUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`

  return (
    <Link to={linkTo} className="movie-card-link">
      <div className="movie-card">
        <img src={imageUrl} alt={title} />

        <div className="movie-info">
          <h3>{title}</h3>
          <p>{date ? date.slice(0, 4) : 'Unknown year'}</p>
        </div>
      </div>
    </Link>
  )
}

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    const loadResults = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await searchMulti(query)

        const filtered = data.results.filter(
          (item) =>
            (item.media_type === 'movie' || item.media_type === 'tv') &&
            item.poster_path
        )

        setResults(filtered)
      } catch (err) {
        console.error(err)
        setError('Failed to load search results.')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [query])

  return (
    <main className="search-page">
      <section className="search-header">
        <p className="hero-label">ANSTUMOVIE</p>
        <h1>
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
      </section>

      {!query && (
        <div className="page-message">
          Type something in the search bar above to get started.
        </div>
      )}

      {query && loading && (
        <div className="page-message">Searching...</div>
      )}

      {query && !loading && error && (
        <div className="page-message">{error}</div>
      )}

      {query && !loading && !error && results.length === 0 && (
        <div className="page-message">
          No results found for "{query}".
        </div>
      )}

      {query && !loading && !error && results.length > 0 && (
        <div className="movie-grid search-grid">
          {results.map((item) => (
            <SearchResultCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Search