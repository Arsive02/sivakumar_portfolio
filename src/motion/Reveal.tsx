import { useRef, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP } from './gsap'
import { prefersReducedMotion } from '@/lib/useReducedMotion'

type Props = {
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'span'
  children: ReactNode
  className?: string
  /** 'lines' masks each line and slides it up; 'fade' is a soft rise. */
  mode?: 'lines' | 'chars' | 'fade'
  delay?: number
  /** Animate on mount instead of on scroll. */
  immediate?: boolean
}

export function Reveal({ as = 'div', children, className, mode = 'lines', delay = 0, immediate = false }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const trigger = immediate ? undefined : { trigger: el, start: 'top 88%', once: true }

      if (mode === 'fade') {
        gsap.from(el, { y: 28, autoAlpha: 0, delay, scrollTrigger: trigger })
        return
      }
      // Never split text that contains components (e.g. a <MathWord>): SplitText's revert()
      // rebuilds the HTML from a string, which detaches React's nodes. Those get a wipe instead
      // (clip-path + rise), which leaves the DOM untouched.
      if (el.querySelector('*')) {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: 40 },
          { clipPath: 'inset(0 0 -40% 0)', y: 0, duration: 1.2, delay, scrollTrigger: trigger, onComplete: () => void (el.style.clipPath = 'none') },
        )
        return
      }
      // The line masks (overflow: hidden) are only needed during the reveal. Once it finishes,
      // revert the split so nothing stays clipped: highlighted words draw below and around
      // their text, and long phrases need to wrap normally.
      let done = false
      const split = SplitText.create(el, {
        type: mode === 'chars' ? 'lines,chars' : 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          if (done) return self.revert()
          return gsap.from(mode === 'chars' ? self.chars : self.lines, {
            yPercent: 110,
            stagger: mode === 'chars' ? 0.018 : 0.08,
            duration: 1.2,
            delay,
            scrollTrigger: trigger,
            onComplete: () => {
              done = true
              self.revert()
            },
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  const Tag = as as 'div'
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  )
}
