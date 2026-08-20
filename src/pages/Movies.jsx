import { useEffect, useState } from 'react'
import {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from '../services/tmdb'

import MovieRow from '../components/MovieRow'
import './Movies.css'

function Movies() {
  const [popular, setPopular] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [
          popularData,
          nowPlayingData,
          topRatedData,
          upcomingData,
        ] = await Promise.all([
          getPopularMovies(),
          getNowPlayingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ])

        setPopular(popularData.results)
        setNowPlaying(nowPlayingData.results)
        setTopRated(topRatedData.results)
        setUpcoming(upcomingData.results)
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
    return (
      <div className="page-message">
        Loading movies...
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-message">
        {error}
      </div>
    )
  }

  return (
    <main className="movies-page">

      <section className="movies-header">
        <p className="hero-label">
          ANSTUMOVIE
        </p>

        <h1>Movies</h1>

        <p>
          Discover popular, new, and highly rated movies.
        </p>
      </section>

      <section className="movies-content">

        <MovieRow
          title="Popular Movies"
          movies={popular}
        />

        <MovieRow
          title="Now Playing"
          movies={nowPlaying}
        />

        <MovieRow
          title="Top Rated"
          movies={topRated}
        />

        <MovieRow
          title="Upcoming Movies"
          movies={upcoming}
        />

      </section>

    </main>
  )
}

export default Movies