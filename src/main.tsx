import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/index.css'

// SVG-filter refraction in backdrop-filter is a Chromium-only capability.
if (/Chrome\/|Edg\//.test(navigator.userAgent) && !/Firefox/.test(navigator.userAgent)) document.documentElement.classList.add('refraction')

// Remember where navigation started so the view-transition wavefront grows from that point.
addEventListener(
  'pointerdown',
  (e) => {
    document.documentElement.style.setProperty('--vt-x', `${e.clientX}px`)
    document.documentElement.style.setProperty('--vt-y', `${e.clientY}px`)
  },
  { capture: true, passive: true },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
