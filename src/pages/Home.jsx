import { useEffect, useState } from 'react'
import {
  getTrendingMovies,
  getTrendingTV,
  getNowPlayingMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  discoverMoviesByGenre,
  discoverTVByGenre,
  searchKeyword,
  discoverMoviesByKeyword,
  getMovieRecommendations,
  getTVRecommendations,
  getMovieGenres,
} from '../services/tmdb'
import { getContinueWatching } from '../utils/continueWatching'
import MovieRow from '../components/MovieRow'
import HeroCarousel from '../components/HeroCarousel'
import './Home.css'

// TMDB's standard genre IDs (stable, documented constants)
const GENRE = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  fantasy: 14,
  horror: 27,
  mystery: 9648,
  romance: 10749,
  sciFi: 878,
  thriller: 53,
}

const TV_GENRE = {
  actionAdventure: 10759,
  mystery: 9648,
}

// Looks up a real TMDB keyword ID for a themed row (e.g. "time travel"),
// and falls back to a genre-based approximation if TMDB has no matching
// keyword or the keyword turns up nothing.
async function getThemedMovies(keywordQuery, fallbackGenreParam) {
  try {
    const keywordData = await searchKeyword(keywordQuery)
    const keywordId = keywordData.results?.[0]?.id

    if (keywordId) {
      const data = await discoverMoviesByKeyword(keywordId)
      if (data.results?.length > 0) {
        return data.results
      }
    }
  } catch (err) {
    console.error(`Keyword lookup failed for "${keywordQuery}":`, err)
  }

  try {
    const fallbackData = await discoverMoviesByGenre(fallbackGenreParam)
    return fallbackData.results || []
  } catch (err) {
    console.error('Fallback genre fetch failed:', err)
    return []
  }
}

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [genreMap, setGenreMap] = useState({})

  const [rows, setRows] = useState({})
  const [continueWatching] = useState(() => getContinueWatching())
  const [recommendations, setRecommendations] = useState([])
  const [recommendationSource, setRecommendationSource] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Continue Watching reads fresh from localStorage on every mount of
  // Home (i.e. every time the user navigates back to it), via the lazy
  // useState initializer above — so newly watched titles show up
  // immediately without needing an effect.

  useEffect(() => {
    const loadEverything = async () => {
      setLoading(true)
      setError(null)

      try {
        const [trending, genres] = await Promise.all([
          getTrendingMovies(),
          getMovieGenres(),
        ])

        setTrendingMovies(trending.results || [])

        const map = {}
        genres.genres?.forEach((genre) => {
          map[genre.id] = genre.name
        })
        setGenreMap(map)

        const rowFetches = {
          'Trending Series': () => getTrendingTV().then((d) => d.results),
          'New Movies': () => getNowPlayingMovies().then((d) => d.results),
          'Popular TV Shows': () => getPopularTV().then((d) => d.results),
          'Mystery Movies': () =>
            discoverMoviesByGenre(GENRE.mystery).then((d) => d.results),
          'Mystery Series': () =>
            discoverTVByGenre(TV_GENRE.mystery).then((d) => d.results),
          'Action Series': () =>
            discoverTVByGenre(TV_GENRE.actionAdventure).then(
              (d) => d.results
            ),
          'Time Travel': () =>
            getThemedMovies('time travel', GENRE.sciFi),
          'Space Adventure': () =>
            getThemedMovies(
              'space adventure',
              `${GENRE.adventure}|${GENRE.sciFi}`
            ),
          'Top Rated TV Shows': () =>
            getTopRatedTV().then((d) => d.results),
          'Top Rated Movies': () =>
            getTopRatedMovies().then((d) => d.results),
          'Comedy Movies': () =>
            discoverMoviesByGenre(GENRE.comedy).then((d) => d.results),
          Romance: () =>
            discoverMoviesByGenre(GENRE.romance).then((d) => d.results),
          'Horror and Thriller': () =>
            discoverMoviesByGenre(
              `${GENRE.horror}|${GENRE.thriller}`
            ).then((d) => d.results),
          'Crime Movies': () =>
            discoverMoviesByGenre(GENRE.crime).then((d) => d.results),
          'Fantasy and Sci-Fi': () =>
            discoverMoviesByGenre(
              `${GENRE.fantasy}|${GENRE.sciFi}`
            ).then((d) => d.results),
          Documentary: () =>
            discoverMoviesByGenre(GENRE.documentary).then((d) => d.results),
          'Survival Movies': () =>
            getThemedMovies(
              'survival',
              `${GENRE.adventure}|${GENRE.thriller}`
            ),
          'Animation Movies': () =>
            discoverMoviesByGenre(GENRE.animation).then((d) => d.results),
        }

        const entries = Object.entries(rowFetches)

        const settled = await Promise.allSettled(
          entries.map(([, fetcher]) => fetcher())
        )

        const nextRows = {}
        settled.forEach((result, index) => {
          const [title] = entries[index]
          nextRows[title] =
            result.status === 'fulfilled' ? result.value || [] : []
        })

        setRows(nextRows)
      } catch (err) {
        console.error(err)
        setError('Failed to load movies.')
      } finally {
        setLoading(false)
      }
    }

    loadEverything()
  }, [])

  // "Because You Like X" — built from whatever the user most recently
  // watched, once we know what that is
  useEffect(() => {
    const loadRecommendations = async () => {
      if (continueWatching.length === 0) {
        setRecommendations([])
        setRecommendationSource(null)
        return
      }

      const latest = continueWatching[0]

      try {
        const data =
          latest.media_type === 'tv'
            ? await getTVRecommendations(latest.id)
            : await getMovieRecommendations(latest.id)

        setRecommendations(
          (data.results || []).filter((item) => item.poster_path)
        )
        setRecommendationSource(latest.title || latest.name)
      } catch (err) {
        console.error(err)
        setRecommendations([])
        setRecommendationSource(null)
      }
    }

    loadRecommendations()
  }, [continueWatching])

  if (loading) {
    return <div className="page-message">Loading movies...</div>
  }

  if (error) {
    return <div className="page-message">{error}</div>
  }

  const rowOrder = [
    'Trending Movies',
    'Trending Series',
    'New Movies',
    'Popular TV Shows',
  ]

  const rowOrderAfterRecommendations = [
    'Mystery Movies',
    'Mystery Series',
    'Action Series',
    'Time Travel',
    'Space Adventure',
    'Top Rated TV Shows',
    'Top Rated Movies',
    'Comedy Movies',
    'Romance',
    'Horror and Thriller',
    'Crime Movies',
    'Fantasy and Sci-Fi',
    'Documentary',
    'Survival Movies',
    'Animation Movies',
  ]

  return (
    <main className="home-page">
      <HeroCarousel movies={trendingMovies} genreMap={genreMap} />

      {continueWatching.length > 0 && (
        <MovieRow title="Continue Watching" movies={continueWatching} />
      )}

      {/* "Trending Movies" reuses the same data the hero already fetched */}
      <MovieRow title="Trending Movies" movies={trendingMovies} />

      {rowOrder.slice(1).map((title) =>
        rows[title]?.length > 0 ? (
          <MovieRow key={title} title={title} movies={rows[title]} />
        ) : null
      )}

      {recommendations.length > 0 && recommendationSource && (
        <MovieRow
          title={`Because You Like ${recommendationSource}`}
          movies={recommendations}
        />
      )}

      {rowOrderAfterRecommendations.map((title) =>
        rows[title]?.length > 0 ? (
          <MovieRow key={title} title={title} movies={rows[title]} />
        ) : null
      )}
    </main>
  )
}

export default Home