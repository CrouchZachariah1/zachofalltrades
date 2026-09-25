type Props = {
  color?: string
  scale?: number
}

function Bar({ color }: { color: string }) {
  return (
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} metalness={0.5} roughness={0.25} />
  )
}

export function LogoMark({ color = '#4ee3ff', scale = 1 }: Props) {
  return (
    <group scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <circleGeometry args={[0.255, 6]} />
        <meshStandardMaterial color="#070b14" metalness={0.72} roughness={0.28} envMapIntensity={1.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[0.255, 0.016, 8, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.22}
          metalness={0.65}
        />
      </mesh>
      <mesh position={[0, 0.1, 0.012]}>
        <boxGeometry args={[0.2, 0.028, 0.028]} />
        <Bar color={color} />
      </mesh>
      <mesh position={[0, -0.1, 0.012]}>
        <boxGeometry args={[0.2, 0.028, 0.028]} />
        <Bar color={color} />
      </mesh>
      <mesh position={[0, 0, 0.012]} rotation={[0, 0, -0.62]}>
        <boxGeometry args={[0.255, 0.028, 0.028]} />
        <Bar color={color} />
      </mesh>
    </group>
  )
}
