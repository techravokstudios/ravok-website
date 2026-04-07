"use client";

import { memo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Layer 4 — Three.js Sculptor
 * 3D wireframe sculpture that responds to mouse/scroll.
 * Wireframe-to-rendered reveal on hover.
 *
 * Per-page: pass different geometry via the `shape` prop.
 * Default: rotating icosahedron (classical polyhedron = Greek temple aesthetic).
 */

interface SculptorProps {
  shape?: "icosahedron" | "torus" | "column" | "sphere";
  position?: [number, number, number];
  scale?: number;
  wireframeColor?: string;
  solidColor?: string;
}

function WireframeSculpture({
  shape = "icosahedron",
  wireframeColor = "#E8E4DC",
  solidColor = "#C9A84C",
}: Omit<SculptorProps, "position" | "scale">) {
  const wireRef = useRef<THREE.Mesh>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

    // Breathing scale
    const breath = Math.sin(state.clock.elapsedTime * 0.3) * 0.02 + 1;
    groupRef.current.scale.setScalar(breath);

    // Solid mesh opacity follows pointer Y (hover reveal)
    if (solidRef.current) {
      const mat = solidRef.current.material as THREE.MeshStandardMaterial;
      const targetOpacity = state.pointer.y > -0.5 ? 0.15 : 0;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;
    }
  });

  const getGeometry = () => {
    switch (shape) {
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "column":
        return <cylinderGeometry args={[0.5, 0.6, 2.5, 8, 4]} />;
      case "sphere":
        return <sphereGeometry args={[1.2, 16, 12]} />;
      case "icosahedron":
      default:
        return <icosahedronGeometry args={[1.2, 1]} />;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Wireframe mesh — always visible */}
        <mesh ref={wireRef}>
          {getGeometry()}
          <meshBasicMaterial
            color={wireframeColor}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Solid mesh — reveals on hover */}
        <mesh ref={solidRef}>
          {getGeometry()}
          <meshStandardMaterial
            color={solidColor}
            transparent
            opacity={0}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

export const ThreeSculptor = memo(function ThreeSculptor({
  shape = "icosahedron",
  position = [0, 0, 0],
  scale = 1,
  wireframeColor,
  solidColor,
}: SculptorProps) {
  // Check device capability
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    // Skip 3D on mobile for performance
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 20 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#E8E4DC" />
        <pointLight position={[-3, 2, 4]} intensity={0.3} color="#C9A84C" />

        <Suspense fallback={null}>
          <group position={position} scale={scale}>
            <WireframeSculpture
              shape={shape}
              wireframeColor={wireframeColor}
              solidColor={solidColor}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
});
