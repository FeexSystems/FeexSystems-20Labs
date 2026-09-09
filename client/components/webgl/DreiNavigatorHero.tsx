import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Edges, Trail, Stars, Html, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";

function QueryOrbital({
  color,
  speed = 1,
  radius = 2.4,
}: {
  color: string;
  speed?: number;
  radius?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.8;
    }
  });

  return (
    <Trail
      width={1.6}
      length={7}
      color={color}
      attenuation={(t) => t * t}
      target={meshRef}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

function ReasoningCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6;
      coreRef.current.rotation.x += delta * 0.4;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.3;
      outerRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Central crystalline core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#090a0f"
          roughness={0.15}
          metalness={0.9}
        />
        <Edges threshold={15} color="#00F5D4" scale={1.002} />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial wireframe color="#facc15" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export function DreiNavigatorHero() {
  return (
    <div className="relative h-52 sm:h-64 w-full overflow-hidden border-b border-gray-20 bg-[#040406]">
      {/* Structural cross-hatch fill style */}
      <div className="bg-diagonal-stripes absolute inset-0 opacity-15 pointer-events-none" />

      {/* Screen-space telemetry badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
        <span className="size-2 rounded-full bg-cyan animate-ping" />
        <span className="text-[10px] font-mono tracking-widest text-cyan uppercase bg-black/60 px-2 py-0.5 border border-cyan/30 rounded">
          FEEX // GROUNDED RETRIEVAL ACTIVE
        </span>
      </div>

      <div className="absolute top-4 right-6 z-10 hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-40">
        <span>MODEL: GEMINI ENTERPRISE</span>
        <span className="text-gray-20">|</span>
        <span>EVIDENCE: 100% GROUNDED</span>
      </div>

      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={1.6} color="#00F5D4" />
        <pointLight position={[-6, -6, -6]} intensity={1.2} color="#facc15" />

        <Stars radius={40} depth={20} count={350} factor={3} saturation={0} fade speed={1} />
        <DreiSparkles count={35} scale={[8, 4, 8]} size={2} color="#00F5D4" opacity={0.6} />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.7}>
          <ReasoningCore />
          <QueryOrbital color="#00F5D4" speed={1.3} radius={2.2} />
          <QueryOrbital color="#facc15" speed={0.9} radius={2.8} />

          {/* Screen space label directly in 3D center */}
          <Html center distanceFactor={13} className="pointer-events-none select-none">
            <div className="px-2.5 py-1 rounded-full bg-black/85 border border-cyan/60 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.35)] text-[10px] font-mono tracking-widest text-cyan uppercase whitespace-nowrap">
              Evidence Fabric
            </div>
          </Html>
        </Float>
      </Canvas>
    </div>
  );
}

export default DreiNavigatorHero;
