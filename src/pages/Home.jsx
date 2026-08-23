import { useEffect, useState } from 'react'
import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieGenres,
} from '../services/tmdb'
import MovieRow from '../components/MovieRow'
import HeroCarousel from '../components/HeroCarousel'
import './Home.css'

function Home() {
  const [popularMovies, setPopularMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [genreMap, setGenreMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [popular, trending, topRated, upcoming, genres] =
          await Promise.all([
            getPopularMovies(),
            getTrendingMovies(),
            getTopRatedMovies(),
            getUpcomingMovies(),
            getMovieGenres(),
          ])

        setPopularMovies(popular.results)
        setTrendingMovies(trending.results)
        setTopRatedMovies(topRated.results)
        setUpcomingMovies(upcoming.results)

        const map = {}
        genres.genres?.forEach((genre) => {
          map[genre.id] = genre.name
        })
        setGenreMap(map)
      } catch (err) {
        console.error(err)
        setError('Failed to load movies.')
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  if (loading) {
    return <div className="page-message">Loading movies...</div>
  }

  if (error) {
    return <div className="page-message">{error}</div>
  }

  return (
    <main className="home-page">
      <HeroCarousel movies={trendingMovies} genreMap={genreMap} />

      <MovieRow
        title="Popular Movies"
        movies={popularMovies}
      />
      <MovieRow
        title="Trending Now"
        movies={trendingMovies}
      />
      <MovieRow
        title="Top Rated"
        movies={topRatedMovies}
      />
      <MovieRow
        title="Upcoming Movies"
        movies={upcomingMovies}
      />
    </main>
  )
}

export default Home