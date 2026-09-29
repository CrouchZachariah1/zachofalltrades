import { create } from 'zustand'
import type { QuoteExtras } from '../config/offers.ts'
import { sceneFromProgress, type SceneId } from '../config/scenes.ts'

export type { SceneId }

export const live = {
  progress: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  ready: false,
  pcLabels: 0,
}

export type InspectItem = {
  title: string
  body: string
  service?: string
  progress?: number
  status?: string
}

type ExperienceState = {
  ready: boolean
  boot: number
  scene: SceneId
  compactNav: boolean
  prefillService: string
  prefillExtras: QuoteExtras
  quoteTick: number
  hoveredNode: string | null
  nodeDesc: string
  hoveredLabel: string | null
  hoveredStatus: string | null
  inspectItem: InspectItem | null
  inspectAt: number | null
  setReady: (ready: boolean) => void
  setBoot: (boot: number) => void
  setSceneFromProgress: (p: number) => void
  setCompactNav: (compactNav: boolean) => void
  setPrefillService: (prefillService: string) => void
  requestQuote: (service?: string, extras?: QuoteExtras) => void
  setHoveredNode: (hoveredNode: string | null, nodeDesc?: string) => void
  setHover: (hoveredLabel: string | null, hoveredStatus?: string) => void
  setInspect: (inspectItem: InspectItem | null) => void
}

export const useExperience = create<ExperienceState>((set, get) => ({
  ready: false,
  boot: 0,
  scene: 'open',
  compactNav: false,
  prefillService: '',
  prefillExtras: {},
  quoteTick: 0,
  hoveredNode: null,
  nodeDesc: '',
  hoveredLabel: null,
  hoveredStatus: null,
  inspectItem: null,
  inspectAt: null,
  setReady: (ready) => {
    live.ready = ready
    if (get().ready === ready) return
    set({ ready })
  },
  setBoot: (boot) => set({ boot }),
  setSceneFromProgress: (p) => {
    const scene = sceneFromProgress(p)
    if (scene !== get().scene) set({ scene })
  },
  setCompactNav: (compactNav) => {
    if (get().compactNav !== compactNav) set({ compactNav })
  },
  setPrefillService: (prefillService) => set({ prefillService }),
  requestQuote: (service, extras) =>
    set((s) => ({
      prefillService: service ?? '',
      prefillExtras: extras ?? {},
      quoteTick: s.quoteTick + 1,
      inspectItem: null,
      inspectAt: null,
    })),
  setHoveredNode: (hoveredNode, nodeDesc = '') => set({ hoveredNode, nodeDesc }),
  setHover: (hoveredLabel, hoveredStatus = '') =>
    set({
      hoveredLabel,
      hoveredStatus: hoveredLabel ? hoveredStatus || 'DEVICE DETECTED' : null,
    }),
  setInspect: (inspectItem) =>
    set({ inspectItem, inspectAt: inspectItem ? live.progress : null }),
}))
