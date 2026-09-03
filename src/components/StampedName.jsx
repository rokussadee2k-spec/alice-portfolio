import { useEffect, useMemo, useState } from 'react'

/* The name, set letter by letter, each with its own rotation, size, drift,
   spacing and ink seed. Every few seconds the whole thing is re-stamped.
   Held still for anyone who has asked for reduced motion. */

function jitter() {
  return {
    rot: (Math.random() * 14 - 7).toFixed(2),        // -11deg .. +11deg
    scale: (0.84 + Math.random() * 0.26).toFixed(3),  // 0.84 .. 1.20
    dy: (Math.random() * 8 - 4).toFixed(2),         // vertical drift, px
    kern: (Math.random() * 0.13 - 0.045).toFixed(3),  // letter spacing, em
    seed: Math.floor(Math.random() * 200),
    erode: (0.04 + Math.random() * 0.05).toFixed(3)   // ink stays near-solid
  }
}

export default function StampedName({ text, interval = 5000 }) {
  const chars = useMemo(() => [...text], [text])
  const [marks, setMarks] = useState(() => chars.map(jitter))

  // re-stamp on a timer
  useEffect(() => {
    if (!interval) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setMarks(chars.map(jitter)), interval)
    return () => clearInterval(id)
  }, [chars, interval])

  return (
    <span className="stamp" role="text" aria-label={text}>
      <svg className="stamp-defs" aria-hidden="true" focusable="false">
        <defs>
          {marks.map((m, i) => (
            <filter
              key={i}
              id={`ink-${i}`}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              {/* coarse blotches, subtracted so the ink breaks up */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.07 0.09"
                numOctaves="4"
                seed={m.seed}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values={`0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0 0
                         0.7 0 0 0 -${m.erode}`}
                result="blotches"
              />
              <feComposite in="SourceGraphic" in2="blotches" operator="out" result="eroded" />

              {/* fine noise, displacing the outline so the edges bleed */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                seed={m.seed + 7}
                result="edge"
              />
              <feDisplacementMap
                in="eroded"
                in2="edge"
                scale="1.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>

      {chars.map((char, i) =>
        char === ' ' ? (
          <span key={i} className="stamp-space" aria-hidden="true">
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className="stamp-letter"
            aria-hidden="true"
            style={{
              filter: `url(#ink-${i})`,
              marginLeft: `${marks[i].kern}em`,
              transform: `translateY(${marks[i].dy}px) rotate(${marks[i].rot}deg) scale(${marks[i].scale})`
            }}
          >
            {char}
          </span>
        )
      )}
    </span>
  )
}