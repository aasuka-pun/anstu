import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <p className="footer-logo">ANSTUMOVIE</p>
          <p className="footer-tagline">
            Discover endless cinematic experiences. Stream trending
            originals, box office hits, and binge-worthy television.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <Link to="/movies">Movies</Link>
          <Link to="/tv">TV Shows</Link>
          <Link to="/search">Search</Link>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <span>Supported Devices</span>
          <span>Audio &amp; Video Specs</span>
          <span>Parental Controls</span>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <span>Help Center</span>
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ANSTUMOVIE. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer