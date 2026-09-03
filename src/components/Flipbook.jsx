import { useCallback, useEffect, useRef, useState } from 'react'

/* A book. Two pages side by side on desktop, one on mobile, and the leaf
   actually turns: the outgoing page rotates on its spine while the incoming
   spread is revealed underneath it.

   With `cover` on, page 1 sits alone on the right like a closed book, and
   turning it opens onto pages 2 and 3. That's how a real book paginates —
   sheet backs face sheet fronts, so odd pages land on the right.

   Pages are images, not a PDF — the browser's PDF viewer can't be driven
   from the outside, so there is nothing to hook a page turn onto. */

export default function Flipbook({
  items,
  caption,
  pageAspect = 0.707,
  cover = true,
  pdf,
  pdfLabel
}) {
  const [spread, setSpread] = useState(0)
  const [flip, setFlip] = useState(null) // { dir, front, back, target }
  const [turning, setTurning] = useState(false)
  const [per, setPer] = useState(2) // pages visible at once
  const prevPer = useRef(2)

  // one page at a time on narrow screens — a spread is unreadable on a phone
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const apply = () => setPer(mq.matches ? 1 : 2)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  /* ---- pagination ----------------------------------------------------
     per 1:            spread s -> page s
     per 2, no cover:  spread s -> pages 2s, 2s+1
     per 2, cover:     spread 0 -> [blank | page 0]
                       spread s -> pages 2s-1, 2s
     -------------------------------------------------------------------- */

  const pageAt = (s, side, p = per) => {
    if (p === 1) return items[s] || null
    if (cover) {
      if (s === 0) return side === 'right' ? items[0] || null : null
      const left = 2 * s - 1
      return items[side === 'right' ? left + 1 : left] || null
    }
    return items[s * 2 + (side === 'right' ? 1 : 0)] || null
  }

  const lastSpread =
    per === 1
      ? items.length - 1
      : cover
        ? Math.ceil((items.length - 1) / 2)
        : Math.ceil(items.length / 2) - 1

  // leading page of a spread, and the spread holding a given page
  const firstPageOf = (s, p) => {
    if (p === 1) return s
    if (cover) return s === 0 ? 0 : 2 * s - 1
    return s * 2
  }

  const spreadOfPage = (idx, p) => {
    if (p === 1) return idx
    if (cover) return idx === 0 ? 0 : Math.floor((idx + 1) / 2)
    return Math.floor(idx / 2)
  }

  // keep your place when the layout switches between one page and two
  useEffect(() => {
    const before = prevPer.current
    if (before === per) return
    prevPer.current = per
    setSpread((s) => spreadOfPage(firstPageOf(s, before), per))
  }, [per])

  // kick the transition off on the frame after the leaf mounts
  useEffect(() => {
    if (!flip) return
    const id = requestAnimationFrame(() => setTurning(true))
    return () => cancelAnimationFrame(id)
  }, [flip])

  const land = useCallback(() => {
    if (!flip) return
    setSpread(flip.target)
    setFlip(null)
    setTurning(false)
  }, [flip])

  const turn = useCallback(
    (dir) => {
      if (flip) return // already mid-turn
      const target = dir === 'next' ? spread + 1 : spread - 1
      if (target < 0 || target > lastSpread) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setSpread(target)
        return
      }

      const side = per === 2 ? 'right' : 'left'
      setFlip(
        dir === 'next'
          ? { dir, front: pageAt(spread, side), back: pageAt(target, 'left'), target }
          : { dir, front: pageAt(spread, 'left'), back: pageAt(target, side), target }
      )
    },
    [flip, spread, lastSpread, per, items, cover]
  )

  const jump = (target) => {
    if (flip) return
    setSpread(Math.min(lastSpread, Math.max(0, target)))
  }

  /* What sits under the turning leaf. On a forward turn the left page holds
     still and the right side already shows where you're going; backwards is
     the mirror of that. */
  let baseLeft, baseRight
  if (!flip) {
    baseLeft = pageAt(spread, 'left')
    baseRight = pageAt(spread, 'right')
  } else if (per === 1) {
    baseLeft = pageAt(flip.target, 'left')
    baseRight = null
  } else if (flip.dir === 'next') {
    baseLeft = pageAt(spread, 'left')
    baseRight = pageAt(flip.target, 'right')
  } else {
    baseLeft = pageAt(flip.target, 'left')
    baseRight = pageAt(spread, 'right')
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); turn('next') }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn('prev') }
    if (e.key === 'Home') { e.preventDefault(); jump(0) }
    if (e.key === 'End') { e.preventDefault(); jump(lastSpread) }
  }

  // human page numbers for the counter
  const first = firstPageOf(spread, per) + 1
  const showsTwo = per === 2 && !!pageAt(spread, 'left') && !!pageAt(spread, 'right')
  const last = showsTwo ? first + 1 : first

  return (
    <figure className="flipbook">
      {caption && <figcaption className="block-caption">{caption}</figcaption>}

      <div
        className={`flip-stage${per === 1 ? ' is-single' : ''}`}
        style={{ aspectRatio: String(per === 2 ? pageAspect * 2 : pageAspect) }}
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-roledescription="book"
        aria-label={caption || 'Pages'}
      >
        <div className="flip-base">
          <div className="flip-page">
            {baseLeft && <img src={baseLeft.src} alt={baseLeft.alt || ''} decoding="async" />}
          </div>
          {per === 2 && (
            <div className="flip-page">
              {baseRight && <img src={baseRight.src} alt={baseRight.alt || ''} decoding="async" />}
            </div>
          )}
        </div>

        {/* the spine only reads as one once the book is open */}
        {per === 2 && spread > 0 && <span className="flip-gutter" aria-hidden="true" />}

        {flip && (
          <div
            className={`flip-leaf flip-leaf--${flip.dir}${turning ? ' is-turning' : ''}`}
            onTransitionEnd={land}
            aria-hidden="true"
          >
            <div className="flip-face flip-face--front">
              {flip.front && <img src={flip.front.src} alt="" />}
            </div>
            <div className="flip-face flip-face--back">
              {flip.back && <img src={flip.back.src} alt="" />}
            </div>
          </div>
        )}

        {/* click the left or right side to turn */}
        <button
          type="button"
          className="flip-half flip-half--prev"
          onClick={() => turn('prev')}
          disabled={spread === 0}
          aria-label="Previous page"
        />
        <button
          type="button"
          className="flip-half flip-half--next"
          onClick={() => turn('next')}
          disabled={spread === lastSpread}
          aria-label="Next page"
        />
      </div>

      <div className="flip-bar">
        <button type="button" className="btn" onClick={() => turn('prev')} disabled={spread === 0}>
          prev
        </button>

        <input
          className="flip-scrub"
          type="range"
          min={0}
          max={lastSpread}
          value={spread}
          onChange={(e) => jump(Number(e.target.value))}
          aria-label={`Pages ${first} to ${last} of ${items.length}`}
        />

        <span className="flip-count" aria-live="polite">
          {first === last ? first : `${first}–${last}`} / {items.length}
        </span>

        <button type="button" className="btn" onClick={() => turn('next')} disabled={spread === lastSpread}>
          next
        </button>

        {pdf && (
          <a className="btn btn--ghost" href={pdf} target="_blank" rel="noreferrer">
            {pdfLabel || 'open the pdf'}
          </a>
        )}
      </div>
    </figure>
  )
}