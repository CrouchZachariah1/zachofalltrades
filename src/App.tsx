import { lazy, Suspense, useEffect, useState } from 'react'
import { usePointer } from './hooks/usePointer.ts'
import { useSmoothScroll } from './hooks/useSmoothScroll.ts'
import { detectAppMode, type Quality } from './lib/quality.ts'
import { applyTheme, readTheme } from './lib/theme.ts'
import { Contact } from './overlay/Contact.tsx'
import { DomainNote } from './overlay/DomainNote.tsx'
import { Cursor } from './overlay/Cursor.tsx'
import { ErrorBoundary } from './overlay/ErrorBoundary.tsx'
import { Fallback2D } from './overlay/Fallback2D.tsx'
import { Footer } from './overlay/Footer.tsx'
import { InspectCard } from './overlay/InspectCard.tsx'
import { Loader } from './overlay/Loader.tsx'
import { Narrative } from './overlay/Narrative.tsx'
import { Nav } from './overlay/Nav.tsx'
import { ProgressRail } from './overlay/ProgressRail.tsx'
import { ScrollBar } from './overlay/ScrollBar.tsx'
import { useExperience } from './store/experience.ts'

const CanvasRoot = lazy(() =>
  import('./experience/CanvasRoot.tsx').then((mod) => ({ default: mod.CanvasRoot })),
)

export default function App() {
  const [mode] = useState(() => detectAppMode())
  const [quality, setQuality] = useState<Quality>(mode.quality)
  const [force2d, setForce2d] = useState(false)
  const setReady = useExperience((s) => s.setReady)
  const use3d = mode.mode === '3d' && !force2d

  useSmoothScroll(use3d)
  usePointer(use3d)

  useEffect(() => {
    applyTheme(readTheme())
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-2d', !use3d)
    document.documentElement.classList.toggle('is-mobile', quality.mobile)
    const failsafe = window.setTimeout(() => setReady(true), use3d ? 2500 : 400)
    if (!use3d) {
      const t = window.setTimeout(() => setReady(true), 120)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(failsafe)
      }
    }
    return () => window.clearTimeout(failsafe)
  }, [use3d, quality.mobile, setReady])

  return (
    <div className="app">
      <a className="skip" href="#contact">
        Skip to contact
      </a>
      <Loader />
      <DomainNote />
      <Nav />
      {use3d ? (
        <ErrorBoundary fallback={<Fallback2D />} onError={() => setForce2d(true)}>
          <Suspense fallback={null}>
            <CanvasRoot quality={quality} onQuality={setQuality} onFail={() => setForce2d(true)} />
          </Suspense>
          <Narrative />
          <InspectCard />
          <ProgressRail />
          <div className="scroll-track" aria-hidden />
        </ErrorBoundary>
      ) : (
        <>
          <Fallback2D reason={mode.reason} />
          <InspectCard />
          <ScrollBar />
        </>
      )}
      <Contact />
      <Footer />
      {!quality.mobile && use3d && <Cursor />}
    </div>
  )
}
