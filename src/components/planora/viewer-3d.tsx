import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { Plan, Project } from "@/lib/planora";

type Mode = "orbit" | "zoom" | "pan" | "walk";

export default function Viewer3D({
  plan,
  project,
  mode,
}: {
  plan: Plan;
  project: Project;
  mode: Mode;
}) {
  const cx = project.plotWidth / 2;
  const cz = project.plotLength / 2;
  const span = Math.max(project.plotWidth, project.plotLength);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{
        position:
          mode === "walk" ? [cx, 5.5, cz + span * 0.15] : [cx + span * 0.8, span * 0.75, cz + span * 0.9],
        fov: mode === "walk" ? 70 : 45,
      }}
    >
      <color attach="background" args={["#050A10"]} />
      <fog attach="fog" args={["#050A10", span * 1.2, span * 3]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[span, span * 1.4, span * 0.6]}
        intensity={1.2}
        castShadow
      />
      <Environment preset="city" />

      <group position={[-cx, 0, -cz]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, cz]} receiveShadow>
          <planeGeometry args={[project.plotWidth, project.plotLength]} />
          <meshStandardMaterial color="#0D1722" roughness={0.9} />
        </mesh>
        {plan.rooms.map((r) => (
          <RoomVolume key={r.id} x={r.x} z={r.y} w={r.w} d={r.h} />
        ))}
      </group>

      <Grid
        position={[0, -0.02, 0]}
        args={[span * 3, span * 3]}
        cellSize={2}
        cellColor="#1B2A38"
        sectionSize={10}
        sectionColor="#1597E5"
        fadeDistance={span * 2.4}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        target={[0, 1.5, 0]}
        enableRotate={mode === "orbit" || mode === "walk"}
        enablePan={mode === "pan" || mode === "orbit"}
        enableZoom={mode === "zoom" || mode === "orbit"}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

function RoomVolume({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  const h = 3;
  const t = 0.28;
  const walls = useMemo(
    () => [
      { p: [x + w / 2, h / 2, z] as const, s: [w, h, t] as const },
      { p: [x + w / 2, h / 2, z + d] as const, s: [w, h, t] as const },
      { p: [x, h / 2, z + d / 2] as const, s: [t, h, d] as const },
      { p: [x + w, h / 2, z + d / 2] as const, s: [t, h, d] as const },
    ],
    [x, z, w, d],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + w / 2, 0.02, z + d / 2]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#09111A" roughness={0.8} />
      </mesh>
      {walls.map((wall, i) => (
        <mesh key={i} position={wall.p as unknown as THREE.Vector3Tuple} castShadow receiveShadow>
          <boxGeometry args={wall.s as unknown as [number, number, number]} />
          <meshStandardMaterial color="#16222E" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}
