/* Two PDFs next to each other, each scrolling vertically in its own frame.
   The browser's built-in viewer does the scrolling, so there is nothing to
   ship. iOS Safari refuses to scroll embedded PDFs, so every frame also
   carries a plain link out. */

export default function PdfPair({ items }) {
  return (
    <div className="pdf-pair">
      {items.map((pdf) => (
        <figure className="pdf-frame" key={pdf.src}>
          <div className="pdf-window">
            <object data={`${pdf.src}#view=FitH&toolbar=0`} type="application/pdf">
              <div className="pdf-fallback">
                <p>Your browser won't display this one inline.</p>
                <a className="btn" href={pdf.src} target="_blank" rel="noreferrer">
                  open {pdf.label}
                </a>
              </div>
            </object>
          </div>
          <figcaption>
            <span>{pdf.label}</span>
            <a className="btn btn--ghost" href={pdf.src} target="_blank" rel="noreferrer">
              open full size
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
