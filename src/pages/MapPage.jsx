import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getMap, maps } from '../data/callouts'

function GameBadge({ games }) {
  const both = games.includes('cs2') && games.includes('csgo')
  return (
    <span className={`game-badge ${both ? 'badge-both' : 'badge-csgo'}`}>
      {both ? 'CS2 + CS:GO' : 'CS:GO only'}
    </span>
  )
}

function highlight(text, query) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
  )
}

export default function MapPage() {
  const { mapId } = useParams()
  const map = getMap(mapId)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return map?.callouts ?? []
    const q = query.toLowerCase()
    return (map?.callouts ?? []).filter(
      c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [query, map])

  if (!map) return <Navigate to="/callouts" replace />

  const idx   = maps.findIndex(m => m.id === mapId)
  const prev  = maps[idx - 1]
  const next  = maps[idx + 1]

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
          <Link to="/callouts" className="nav-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All maps
          </Link>
        </div>
      </nav>

      <div className="container">
        {/* Map hero */}
        <div className="map-hero">
          <h1 className="map-hero-title">
            <span>{map.name}</span> Callouts
          </h1>
          <p className="map-hero-desc">{map.description}</p>
          <div className="map-hero-badges">
            <GameBadge games={map.games} />
            <span className="count-badge">{map.callouts.length} callouts</span>
          </div>
        </div>

        {/* Map image */}
        <div className="map-image-wrap">
          <img
            src={map.image}
            alt={`${map.name} callout map`}
            className="map-image"
          />
        </div>

        {/* Callouts table */}
        <section className="callouts-section">
          <div className="section-header">
            <div className="section-left">
              <h2 className="section-title">Callouts Table</h2>
              {query.trim() && (
                <span className="count-badge">
                  {filtered.length} / {map.callouts.length}
                </span>
              )}
            </div>
            <div className="search-wrap">
              <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search callouts…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              No callouts match &ldquo;{query}&rdquo;
            </div>
          ) : (
            <table className="callout-table">
              <thead>
                <tr>
                  <th>Callout</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={i} className="callout-row">
                    <td>
                      <span className="callout-name">
                        {highlight(c.name, query)}
                      </span>
                    </td>
                    <td className="callout-desc">
                      {highlight(c.description, query)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Prev / next map nav */}
        {(prev || next) && (
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 48px', gap:'12px' }}>
            {prev ? (
              <Link to={`/callouts/${prev.id}`} style={{ color:'var(--muted)', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                {prev.name}
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/callouts/${next.id}`} style={{ color:'var(--muted)', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px' }}>
                {next.name}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ) : <span />}
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-text">
            <Link to="/callouts">← Browse all maps</Link>
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
