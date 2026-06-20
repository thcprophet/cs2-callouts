import { useState, useRef, useMemo, useCallback } from 'react'
import { regions as allRegions } from '../data/regions'

const TOOLTIP_W = 248

export default function InteractiveMap({ map, hoveredCallout, onHover }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0, w: 0, h: 0 })
  const wrapRef = useRef(null)

  // Build name→callout lookup for tooltip description
  const calloutLookup = useMemo(
    () => Object.fromEntries(map.callouts.map(c => [c.name, c])),
    [map]
  )

  // Only the callouts that have a region polygon defined for this map
  const mapRegions = allRegions[map.id] ?? {}
  const regionEntries = Object.entries(mapRegions)

  const handleMouseMove = useCallback((e) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height })
  }, [])

  // Tooltip: prefer right side of cursor, flip left if it would overflow
  const tooltipX = mouse.x + 16 + TOOLTIP_W > mouse.w
    ? mouse.x - TOOLTIP_W - 8
    : mouse.x + 16
  const tooltipY = Math.max(8, mouse.y - 28)

  const active = hoveredCallout ? calloutLookup[hoveredCallout] : null

  return (
    <div
      ref={wrapRef}
      className="map-interactive-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={map.image}
        alt={`${map.name} callout map`}
        className="map-image"
        draggable={false}
      />

      {/* SVG overlay — viewBox 0 0 100 100 with preserveAspectRatio="none"
          maps percentage coordinates exactly onto the image */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="map-svg-overlay"
        aria-hidden="true"
      >
        {regionEntries.map(([name, points]) => (
          <polygon
            key={name}
            points={points}
            className={`map-region${hoveredCallout === name ? ' active' : ''}`}
            onMouseEnter={() => onHover(name)}
            onMouseLeave={() => onHover(null)}
          />
        ))}
      </svg>

      {/* Tooltip — follows cursor, shows only when a region with a description is hovered */}
      {active && (
        <div
          className="map-tooltip"
          style={{ left: tooltipX, top: tooltipY }}
          aria-live="polite"
        >
          <div className="tooltip-name">{active.name}</div>
          <div className="tooltip-desc">{active.description}</div>
        </div>
      )}

      {regionEntries.length === 0 && (
        <div className="map-no-regions">
          No interactive regions defined for this map yet
        </div>
      )}
    </div>
  )
}
