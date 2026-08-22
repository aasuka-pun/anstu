import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    accept: 'application/json',
  },
})

api.interceptors.response.use((response) => response.data)

export const getPopularMovies = () => {
  return api.get('/movie/popular')
}

export const getTrendingMovies = () => {
  return api.get('/trending/movie/week')
}

export const getTopRatedMovies = () => {
  return api.get('/movie/top_rated')
}

export const getUpcomingMovies = () => {
  return api.get('/movie/upcoming')
}

export const getNowPlayingMovies = () => {
  return api.get('/movie/now_playing')
}

export const getPopularTV = () => {
  return api.get('/tv/popular')
}

export const getAiringTodayTV = () => {
  return api.get('/tv/airing_today')
}

export const getOnTheAirTV = () => {
  return api.get('/tv/on_the_air')
}

export const getTopRatedTV = () => {
  return api.get('/tv/top_rated')
}

export const getMovieDetails = (id) => {
  return api.get(`/movie/${id}`)
}

export const getMovieCredits = (id) => {
  return api.get(`/movie/${id}/credits`)
}

export const getMovieVideos = (id) => {
  return api.get(`/movie/${id}/videos`)
}

export const getSimilarMovies = (id) => {
  return api.get(`/movie/${id}/similar`)
}

export const getTVDetails = (id) => {
  return api.get(`/tv/${id}`)
}

export const getTVSeason = (id, seasonNumber) => {
  return api.get(`/tv/${id}/season/${seasonNumber}`)
}

export const getTVVideos = (id, seasonNumber, episodeNumber) => {
  return api.get(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos`
  )
}

export const searchMulti = (query) => {
  return api.get('/search/multi', {
    params: { query },
  })
}