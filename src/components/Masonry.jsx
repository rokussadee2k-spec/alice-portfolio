import { useEffect, useState } from 'react'
import { RichText } from './Blocks.jsx'

/* Masonry via CSS multi-columns: no library, no measuring, and it copes with
   images of any size. Three columns on desktop, two on mobile. */

export default function Masonry({ items }) {
  const [zoom, setZoom] = useState(null)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoom])

     const images = items.filter((it) => it.type !== 'text')
  const texts = items.filter((it) => it.type === 'text')
  const split = !narrow && texts.length > 0

    const imageTile = (item) => (
    <button
      key={item.src}
      type="button"
      className="masonry-item"
      onClick={() => setZoom(item)}
      aria-label={`View larger: ${item.alt || 'image'}`}
    >
      <img src={item.src} alt={item.alt || ''} loading="lazy" decoding="async" />
    </button>
  )
  return (
    <>
                  {split ? (
        <div className="masonry-split">
          <div className="masonry masonry--one">{images.map(imageTile)}</div>
          <div className="masonry-wide">
                        {texts.map((t, i) => (
              <TextTile key={`w${i}`} item={t} collapsible={false} />
            ))}
          </div>
        </div>
      ) : (
                <>
          <div className="masonry">{images.map(imageTile)}</div>
          {texts.map((t, i) => (
            <TextTile key={`a${i}`} item={t} collapsible={true} />
          ))}
        </>
      )}

      {zoom && (
        <div className="zoom" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          <img src={zoom.src} alt={zoom.alt || ''} />
          <button type="button" className="zoom-close" onClick={() => setZoom(null)}>
            close
          </button>
        </div>
      )}
    </>
  )
}

function TextTile({ item, collapsible }) {
  const [open, setOpen] = useState(false)

  if (!collapsible) {
    return (
      <div className="masonry-text">
        {item.heading && <p className="masonry-text-heading">{item.heading}</p>}
        <RichText text={item.body} />
      </div>
    )
  }

  return (
    <div className={`masonry-text masonry-text--fold${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="masonry-text-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{item.heading || 'Read the text'}</span>
        <span className="masonry-text-sign" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <div className="masonry-text-panel" {...(open ? {} : { inert: '' })}>
        <div className="masonry-text-clip">
          <div className="masonry-text-body">
            <RichText text={item.body} />
          </div>
        </div>
      </div>
    </div>
  )
}