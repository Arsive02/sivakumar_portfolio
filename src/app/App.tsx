import { Suspense, useState } from 'react'
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router'
import Home from '@/pages/Home'
import { Nav } from '@/ui/Nav'
import { Cursor } from '@/ui/Cursor'
import { SmoothScroll } from '@/motion/SmoothScroll'
import { useIdle } from '@/lib/useIdle'
import { hasWebGL2 } from '@/lib/webgl'
import { setIntro, shouldPlayIntro, useIntroActive } from '@/intro/state'
import { lazyWithRetry as lazy } from '@/lib/lazyWithRetry'
import RouteError from '@/pages/RouteError'

const GLStage = lazy(() => import('@/gl/GLStage'))
const Intro = lazy(() => import('@/intro/Intro'))

// Decided once per page load, before first render, so the page can start hidden.
const PLAY_INTRO = shouldPlayIntro()
if (PLAY_INTRO) {
  setIntro({ active: true, done: false })
  document.documentElement.classList.add('intro-on')
}
const CommandPalette = lazy(() => import('@/ui/CommandPalette').then((m) => ({ default: m.CommandPalette })))
const CaseStudy = lazy(() => import('@/pages/CaseStudy'))
const Library = lazy(() => import('@/pages/Library'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Shell() {
  const idle = useIdle()
  const [palette, setPalette] = useState(false)
  const introOn = useIntroActive()
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-bg focus:p-2">
        Skip to content
      </a>
      <SmoothScroll />
      <Nav onOpenPalette={() => setPalette(true)} />
      <Cursor />
      {/* WebGL and the command palette load after first paint, off the critical path. */}
      {(idle || introOn) && hasWebGL2() && (
        <Suspense fallback={null}>
          <GLStage />
        </Suspense>
      )}
      {idle && (
        <Suspense fallback={null}>
          <CommandPalette open={palette} setOpen={setPalette} />
        </Suspense>
      )}
      {introOn && (
        <Suspense fallback={null}>
          <Intro
            onDone={() => setIntro({ active: false, done: true })}
          />
        </Suspense>
      )}
      <div data-page className="relative z-10">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Shell />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/work/:slug', element: <CaseStudy /> },
      { path: '/library', element: <Library /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
