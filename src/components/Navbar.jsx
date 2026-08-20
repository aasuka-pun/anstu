import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) return

    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="navbar-logo">
          ANSTUMOVIE
        </Link>

        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/tv"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            TV Shows
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {searchOpen ? (
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search movies & TV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!query) setSearchOpen(false)
                }}
              />
            </form>
          ) : (
            <button
              type="button"
              className="search-button"
              onClick={() => setSearchOpen(true)}
            >
              🔍
            </button>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar