import { Link } from 'react-router-dom'
import { maps } from '../data/callouts'

const totalCallouts = maps.reduce((acc, m) => acc + m.callouts.length, 0)

function GameBadge({ games }) {
  const both = games.includes('cs2') && games.includes('csgo')
  return (
    <span className={`game-badge ${both ? 'badge-both' : 'badge-csgo'}`}>
      {both ? 'CS2 + CS:GO' : 'CS:GO only'}
    </span>
  )
}

export default function IndexPage() {
  return (
    <div className="page">
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            CS<span>2</span> Callouts
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="hero">
          <h1 className="hero-title">
            All <span>CS2</span> &amp; CS:GO<br />Callouts
          </h1>
          <p className="hero-sub">
            A complete reference for all map callouts in Counter-Strike 2 and CS:GO.
            Click a map to view its callouts and search by name.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{maps.length}</span>
              <span className="stat-label">Maps</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalCallouts}</span>
              <span className="stat-label">Callouts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{maps.filter(m => m.games.includes('cs2')).length}</span>
              <span className="stat-label">Active in CS2</span>
            </div>
          </div>
        </div>

        <section className="maps-section">
          <div className="maps-grid">
            {maps.map(map => (
              <Link key={map.id} to={`/callouts/${map.id}`} className="map-card">
                <img
                  src={map.image}
                  alt={`${map.name} callout map`}
                  className="map-thumb"
                  loading="lazy"
                />
                <div className="map-info">
                  <div className="map-name">{map.name}</div>
                  <div className="map-meta">
                    <span className="map-count">{map.callouts.length} callouts</span>
                    <GameBadge games={map.games} />
                  </div>
                  <p className="map-desc">{map.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-text">
            CS2 Callouts Reference — hosted at{' '}
            <a href="https://cs.thcprophet.eu/callouts">cs.thcprophet.eu</a>
          </span>
          <span className="footer-text">
            Data sourced from{' '}
            <a href="https://totalcsgo.com/callouts" target="_blank" rel="noopener noreferrer">
              totalcsgo.com
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
