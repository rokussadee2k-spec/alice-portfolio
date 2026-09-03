import { useId } from 'react'

export default function Accordion({ title, meta, open, onToggle, children }) {
  const id = useId()

  return (
    <section className={`acc${open ? ' is-open' : ''}`}>
      <h2 className="acc-heading">
        <button
          type="button"
          className="acc-trigger"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
        >
          <span className="acc-title">{title}</span>
          {meta && <span className="acc-meta">{meta}</span>}
          <span className="acc-sign" aria-hidden="true">
            <i className="acc-sign-bar" />
            <i className="acc-sign-bar acc-sign-bar--v" />
          </span>
        </button>
      </h2>

      <div
        id={`${id}-panel`}
        className="acc-panel"
        role="region"
        aria-label={title}
        {...(open ? {} : { inert: '' })}
      >
        <div className="acc-panel-clip">
          <div className="acc-body">{children}</div>
        </div>
      </div>
    </section>
  )
}
