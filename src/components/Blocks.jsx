/* Small shared blocks: rich text, a flex row of images, and a download link
   that reveals a note on hover or keyboard focus. */

/* ---------------------------------------------------------------------
   RichText — lets descriptions in data.js carry a few inline tags.

   Supported: <i> <em> <b> <strong> <u> and <br>. One tag per span, no
   nesting. Everything else is printed as written, so a stray angle bracket
   in your prose can't turn into markup.

   Each line of the description becomes its own paragraph. Write a
   description as one long line per paragraph — don't wrap it by hand.
   --------------------------------------------------------------------- */

const INLINE = { i: 'em', em: 'em', b: 'strong', strong: 'strong', u: 'u' }
const TAG = /<(i|em|b|strong|u)>([\s\S]*?)<\/\1>|<br\s*\/?>/gi

function inlines(text, key) {
  const out = []
  let cursor = 0
  let n = 0
  let m

  TAG.lastIndex = 0
  while ((m = TAG.exec(text)) !== null) {
    if (m.index > cursor) out.push(text.slice(cursor, m.index))

    if (m[1]) {
      const Tag = INLINE[m[1].toLowerCase()]
      out.push(<Tag key={`${key}-${n++}`}>{m[2]}</Tag>)
    } else {
      out.push(<br key={`${key}-${n++}`} />)
    }
    cursor = m.index + m[0].length
  }

  if (cursor < text.length) out.push(text.slice(cursor))
  return out
}

export function RichText({ text, className }) {
  const paragraphs = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <>
      {paragraphs.map((line, i) => (
        <p key={i} className={className}>
          {inlines(line, i)}
        </p>
      ))}
    </>
  )
}

export function Row({ items, caption }) {
  return (
    <figure className="row-block">
      {caption && <figcaption className="block-caption">{caption}</figcaption>}
      <div className="row-images">
        {items.map((img) => (
          <img key={img.src} src={img.src} alt={img.alt || ''} loading="lazy" decoding="async" />
        ))}
      </div>
    </figure>
  )
}

export function Download({ href, label, note, sub }) {
  return (
    <p className="download">
      <a className="download-link" href={href} download>
        <span className="download-label">{label}</span>
        {sub && <span className="download-sub">{sub}</span>}
        <span className="download-note" role="tooltip">{note}</span>
      </a>
    </p>
  )
}