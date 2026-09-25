import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { Group } from 'three'
import { inspect, type InspectItem } from '../../lib/actions.ts'
import { live } from '../../store/experience.ts'

type Props = {
  label: string
  body: string
  service?: string
  progress?: number
  anchor?: [number, number, number]
  offset?: [number, number, number]
}

export function PartTag({
  label,
  body,
  service,
  progress,
  anchor = [0, 0, 0],
  offset = [0.22, 0.08, 0],
}: Props) {
  const group = useRef<Group>(null)
  const shown = useRef(false)
  const [open, setOpen] = useState(false)
  const item: InspectItem = { title: label, body, service, progress }

  useFrame(() => {
    const on = live.pcLabels > 0.45
    if (group.current) {
      group.current.visible = on
      const s = 0.7 + 0.3 * live.pcLabels
      group.current.scale.setScalar(s)
    }
    if (on !== shown.current) {
      shown.current = on
      setOpen(on)
    }
  })

  return (
    <group ref={group} visible={false}>
      <mesh position={anchor}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshBasicMaterial color="#4ee3ff" />
      </mesh>
      <Line
        points={[anchor, offset]}
        color="#4ee3ff"
        lineWidth={1}
        transparent
        opacity={0.7}
      />
      {open && (
        <Html
          position={offset}
          center
          sprite
          occlude={false}
          zIndexRange={[12, 0]}
          style={{ pointerEvents: 'auto' }}
        >
          <button
            type="button"
            className="part-tag"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              inspect(item)
            }}
          >
            {label}
          </button>
        </Html>
      )}
    </group>
  )
}
