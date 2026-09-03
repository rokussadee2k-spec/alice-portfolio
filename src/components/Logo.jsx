import { useMemo } from 'react'

/* "a p" in Courier. Each letter gets its own rotation, size and ink seed,
   picked once per page load, so the stamp never lands the same way twice. */

function jitter() {
  return {
    rot: (Math.random() * 16 - 8).toFixed(2),      // -8deg .. +8deg
    scale: (0.88 + Math.random() * 0.3).toFixed(3), // 0.88 .. 1.18
    dy: (Math.random() * 7 - 3.5).toFixed(2),       // vertical drift, px
    seed: Math.floor(Math.random() * 200),
    erode: (0.28 + Math.random() * 0.14).toFixed(3) // how patchy the ink is
  }
}

export default function Logo() {
  const letters = useMemo(() => [jitter(), jitter()], [])

  return (
    <div className="logo" role="img" aria-label="a p">
      <svg className="logo-defs" aria-hidden="true" focusable="false">
        <defs>
          {letters.map((l, i) => (
            <filter
              key={i}
              id={`ink-${i}`}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              {/* coarse blotches, subtracted from the letter so the ink breaks up */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.07 0.09"
                numOctaves="4"
                seed={l.seed}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values={`0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0 0
                         1.6 0 0 0 -${l.erode}`}
                result="blotches"
              />
              <feComposite in="SourceGraphic" in2="blotches" operator="out" result="eroded" />

              {/* fine noise, displacing the outline so the edges bleed */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                seed={l.seed + 7}
                result="edge"
              />
              <feDisplacementMap
                in="eroded"
                in2="edge"
                scale="1.7"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>

      {['a', 'p'].map((char, i) => (
        <span
          key={char}
          className="logo-letter"
          aria-hidden="true"
          style={{
            filter: `url(#ink-${i})`,
            transform: `translateY(${letters[i].dy}px) rotate(${letters[i].rot}deg) scale(${letters[i].scale})`
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
