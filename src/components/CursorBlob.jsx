import { useEffect, useRef, useState } from 'react'

/* A soft yellow blob that trails the cursor. Mouse only — it never mounts on
   touch, where there is no pointer to follow. */

export default function CursorBlob() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(window.matchMedia('(pointer: fine)').matches)
  }, [])

  useEffect(() => {
    if (!on) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduced ? 1 : 0.14 // no lag if motion is turned down

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let raf

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (ref.current) ref.current.style.opacity = '1'
    }

    const leave = () => {
      if (ref.current) ref.current.style.opacity = '0'
    }

    const tick = () => {
      cx += (x - cx) * ease
      cy += (y - cy) * ease
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('mouseleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [on])

  if (!on) return null
  return <div className="blob" ref={ref} aria-hidden="true" />
}