import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import NotFound from './pages/NotFound'
import MovieDetails from './pages/MovieDetails'
import TVDetails from './pages/TVDetails'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<TVShows />} />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

        <Route
          path="/tv/:id"
          element={<TVDetails />}
        />

        <Route path="/search" element={<Search />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App