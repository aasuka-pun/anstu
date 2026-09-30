import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrendingMoviesToday, getMovieVideos } from '../services/tmdb'
import './TrailerHero.css'

const REFRESH_MS = 10 * 60 * 1000 // re-check TMDB trending every 10 minutes
const CANDIDATES = 5 // top N trending movies to look through for a playable trailer

// Best available YouTube clip: official trailer > any trailer > teaser
function pickTrailer(videos = []) {
  const yt = videos.filter((v) => v.site === 'YouTube')
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ||
    yt.find((v) => v.type === 'Trailer') ||
    yt.find((v) => v.type === 'Teaser') ||
    null
  )
}

// Load the YouTube IFrame API once for the whole app
let apiPromise = null
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve(window.YT)
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    })
  }
  return apiPromise
}

function TrailerHero() {
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState([]) // [{ movie, key }] in trending order
  const [badKeys, setBadKeys] = useState([]) // trailers YouTube refused to embed
  const [ready, setReady] = useState(false) // true once video is actually playing

  const wrapperRef = useRef(null)
  const playerRef = useRef(null)
  const keyRef = useRef(null)

  // Trending #1 that has a working trailer (skips ones that fail to embed)
  const current = playlist.find((item) => !badKeys.includes(item.key)) || null
  const videoKey = current?.key || null

  // Keep the latest key available to the player's error callback
  useEffect(() => {
    keyRef.current = videoKey
  }, [videoKey])

  // Fetch trending + trailers now, and again on an interval
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const trending = await getTrendingMoviesToday()
        const top = (trending.results || []).slice(0, CANDIDATES)

        const withTrailers = await Promise.all(
          top.map(async (movie) => {
            try {
              const videos = await getMovieVideos(movie.id)
              const trailer = pickTrailer(videos.results)
              return trailer ? { movie, key: trailer.key } : null
            } catch {
              return null
            }
          })
        )

        if (cancelled) return
        const next = withTrailers.filter(Boolean)

        // Only update state if the lineup changed, so the video isn't restarted needlessly
        setPlaylist((prev) =>
          JSON.stringify(prev.map((p) => [p.movie.id, p.key])) ===
          JSON.stringify(next.map((p) => [p.movie.id, p.key]))
            ? prev
            : next
        )
      } catch (err) {
        console.error('Trailer hero failed to load:', err)
      }
    }

    load()
    const timer = setInterval(load, REFRESH_MS)

    // Refresh right away when the user returns to the tab
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // Create the player once, or swap the video when the #1 trailer changes
  useEffect(() => {
    if (!videoKey) return
    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled || !wrapperRef.current) return

      setReady(false)

      if (playerRef.current) {
        playerRef.current.loadVideoById(videoKey)
        return
      }

      // YouTube replaces the target element, so give it a fresh child div
      const target = document.createElement('div')
      wrapperRef.current.appendChild(target)

      playerRef.current = new YT.Player(target, {
        videoId: videoKey,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          loop: 1,
          playlist: videoKey,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            e.target.mute() // always silent
            e.target.playVideo()
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setReady(true)

            // Never stop: restart when finished
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0)
              e.target.playVideo()
            }

            // Resume if the browser paused it while the tab is visible
            if (
              e.data === YT.PlayerState.PAUSED &&
              document.visibilityState === 'visible'
            ) {
              e.target.playVideo()
            }
          },
          // Video can't be embedded / was removed: move on to the next trending trailer
          onError: () => {
            setBadKeys((prev) =>
              prev.includes(keyRef.current) ? prev : [...prev, keyRef.current]
            )
          },
        },
      })
    })

    return () => {
      cancelled = true
    }
  }, [videoKey])

  // Clean up the player when leaving the page
  useEffect(() => {
    const wrapper = wrapperRef.current
    return () => {
      playerRef.current?.destroy?.()
      playerRef.current = null
      if (wrapper) wrapper.innerHTML = ''
    }
  }, [])

  if (!current) return null

  const { movie } = current
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  return (
    <section
      className="trailer-hero"
      style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
    >
      <div
        ref={wrapperRef}
        className={ready ? 'trailer-frame ready' : 'trailer-frame'}
        aria-hidden="true"
      />

      <div className="trailer-overlay">
        <span className="trailer-badge">🔥 #1 Trending Today</span>

        <h2>{movie.title}</h2>

        <div className="trailer-meta">
          {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
          )}
          {year && <span>{year}</span>}
        </div>

        {movie.overview && <p className="trailer-overview">{movie.overview}</p>}

        <div className="hero-buttons">
          <button
            type="button"
            className="hero-play-button"
            onClick={() => navigate(`/watch/movie/${movie.id}`)}
          >
            ▶ Play
          </button>
          <button
            type="button"
            className="hero-info-button"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            ⓘ Info
          </button>
        </div>
      </div>
    </section>
  )
}

export default TrailerHero