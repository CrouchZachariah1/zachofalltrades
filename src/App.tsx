import { lazy, Suspense, useEffect, useState } from 'react'
import { usePointer } from './hooks/usePointer.ts'
import { useSmoothScroll } from './hooks/useSmoothScroll.ts'
import { detectAppMode, type Quality } from './lib/quality.ts'
import { applyTheme, readTheme } from './lib/theme.ts'
import { Contact } from './overlay/Contact.tsx'
import { DomainNote } from './overlay/DomainNote.tsx'
import { Cursor } from './overlay/Cursor.tsx'
import { ErrorBoundary } from './overlay/ErrorBoundary.tsx'
import { findServicePage } from './config/pages.ts'
import { Fallback2D } from './overlay/Fallback2D.tsx'
import { Footer } from './overlay/Footer.tsx'
import { ServicePage } from './overlay/ServicePage.tsx'
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
  const [page] = useState(() => findServicePage())
  const setReady = useExperience((s) => s.setReady)
  const setCompactNav = useExperience((s) => s.setCompactNav)
  const use3d = !page && mode.mode === '3d' && !force2d

  useSmoothScroll(use3d)
  usePointer(use3d)

  useEffect(() => {
    applyTheme(readTheme())
    if (page) setCompactNav(true)
  }, [page, setCompactNav])

  useEffect(() => {
    document.documentElement.classList.toggle('is-2d', !use3d)
    document.documentElement.classList.toggle('is-mobile', quality.mobile)
    document.documentElement.classList.toggle('is-service', Boolean(page))
    if (!use3d) {
      setReady(true)
      return
    }
    const failsafe = window.setTimeout(() => setReady(true), 2500)
    return () => window.clearTimeout(failsafe)
  }, [use3d, quality.mobile, setReady, page])

  return (
    <div className="app">
      <a className="skip" href="#contact">
        Skip to contact
      </a>
      <Loader />
      <DomainNote />
      <Nav />
      {page ? (
        <>
          <ServicePage page={page} />
          <ScrollBar />
        </>
      ) : use3d ? (
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
