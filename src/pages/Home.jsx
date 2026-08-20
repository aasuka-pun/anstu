import { useEffect, useState } from 'react'
import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from '../services/tmdb'
import MovieRow from '../components/MovieRow'
import './Home.css'

function Home() {
  const [popularMovies, setPopularMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [popular, trending, topRated, upcoming] = await Promise.all([
          getPopularMovies(),
          getTrendingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ])

        setPopularMovies(popular.results)
        setTrendingMovies(trending.results)
        setTopRatedMovies(topRated.results)
        setUpcomingMovies(upcoming.results)
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
      <section className="hero-section">
        <div>
          <p className="hero-label">WELCOME TO ANSTUMOVIE</p>

          <h1>Discover your next movie.</h1>

          <p>
            Explore movies and TV shows from around the world.
          </p>

          <button className="primary-button">
            Explore Movies
          </button>
        </div>
      </section>

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