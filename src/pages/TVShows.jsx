import { useEffect, useState } from 'react'

import {
  getPopularTV,
  getAiringTodayTV,
  getOnTheAirTV,
  getTopRatedTV,
} from '../services/tmdb'

import TVRow from '../components/TVRow'

import './TVShows.css'

function TVShows() {
  const [popular, setPopular] = useState([])
  const [airingToday, setAiringToday] = useState([])
  const [onTheAir, setOnTheAir] = useState([])
  const [topRated, setTopRated] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTVShows = async () => {
      try {
        const [
          popularData,
          airingTodayData,
          onTheAirData,
          topRatedData,
        ] = await Promise.all([
          getPopularTV(),
          getAiringTodayTV(),
          getOnTheAirTV(),
          getTopRatedTV(),
        ])

        setPopular(popularData.results)
        setAiringToday(airingTodayData.results)
        setOnTheAir(onTheAirData.results)
        setTopRated(topRatedData.results)
      } catch (err) {
        console.error(err)
        setError('Failed to load TV shows.')
      } finally {
        setLoading(false)
      }
    }

    loadTVShows()
  }, [])

  if (loading) {
    return (
      <div className="page-message">
        Loading TV shows...
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
    <main className="tv-page">

      <section className="tv-header">

        <p className="hero-label">
          ANSTUMOVIE
        </p>

        <h1>TV Shows</h1>

        <p>
          Explore popular and highly rated TV shows.
        </p>

      </section>

      <section className="tv-content">

        <TVRow
          title="Popular TV Shows"
          shows={popular}
        />

        <TVRow
          title="Airing Today"
          shows={airingToday}
        />

        <TVRow
          title="On The Air"
          shows={onTheAir}
        />

        <TVRow
          title="Top Rated TV Shows"
          shows={topRated}
        />

      </section>

    </main>
  )
}

export default TVShows