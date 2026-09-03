import { useCallback, useState } from 'react'

/* Only a small window of pages is mounted at a time, so 55 scans don't all
   hit the network at once. Pages cross-fade rather than slide, which keeps
   the reading position steady. */

const WINDOW = 2

export default function Carousel({ items, caption, aspect = '3 / 2' }) {
  const [i, setI] = useState(0)
  const last = items.length - 1

  const go = useCallback(
    (next) => setI(Math.min(last, Math.max(0, next))),
    [last]
  )

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
    if (e.key === 'Home') { e.preventDefault(); go(0) }
    if (e.key === 'End') { e.preventDefault(); go(last) }
  }

  return (
    <figure className="carousel">
      {caption && <figcaption className="block-caption">{caption}</figcaption>}

      <div
        className="carousel-stage"
        style={{ aspectRatio: aspect }}
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-roledescription="carousel"
        aria-label={caption || 'Pages'}
      >
        {items.map((page, n) =>
          Math.abs(n - i) <= WINDOW ? (
            <img
              key={page.src}
              src={page.src}
              alt={page.alt || `Page ${n + 1}`}
              className={`carousel-page${n === i ? ' is-current' : ''}`}
              aria-hidden={n !== i}
              decoding="async"
            />
          ) : null
        )}

        {/* click the right half to advance, the left half to go back */}
        <button
          type="button"
          className="carousel-half carousel-half--prev"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label="Previous page"
        />
        <button
          type="button"
          className="carousel-half carousel-half--next"
          onClick={() => go(i + 1)}
          disabled={i === last}
          aria-label="Next page"
        />
      </div>

      <div className="carousel-bar">
        <button type="button" className="btn" onClick={() => go(i - 1)} disabled={i === 0}>
          prev
        </button>

        <input
          className="carousel-scrub"
          type="range"
          min={0}
          max={last}
          value={i}
          onChange={(e) => go(Number(e.target.value))}
          aria-label={`Page ${i + 1} of ${items.length}`}
        />

        <span className="carousel-count" aria-live="polite">
          {String(i + 1).padStart(2, '0')} / {items.length}
        </span>

        <button type="button" className="btn" onClick={() => go(i + 1)} disabled={i === last}>
          next
        </button>
      </div>
    </figure>
  )
}
