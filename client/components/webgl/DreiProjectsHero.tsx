import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Edges, Stars, Html, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";

function TopologyNode({
  position,
  color,
  label,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4 * speed;
      meshRef.current.rotation.y += delta * 0.6 * speed;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#090a0f"
          roughness={0.2}
          metalness={0.9}
        />
        <Edges threshold={15} color={color} scale={1.002} />
      </mesh>
    </group>
  );
}

function ConnectingLines() {
  const points = [
    new THREE.Vector3(-3.2, 0.4, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(3.2, 0.4, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1.6, -1.2, 0.5),
    new THREE.Vector3(1.6, -1.2, 0.5),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#2e3038" transparent opacity={0.6} />
    </lineSegments>
  );
}

export function DreiProjectsHero() {
  return (
    <div className="relative h-52 sm:h-64 w-full overflow-hidden border-b border-gray-20 bg-[#040406]">
      {/* Background wireframe cross-hatching */}
      <div className="bg-diagonal-stripes absolute inset-0 opacity-15 pointer-events-none" />

      {/* Screen-space telemetry overlay badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#00F5D4] animate-ping" />
        <span className="text-[10px] font-mono tracking-widest text-[#00F5D4] uppercase bg-black/60 px-2 py-0.5 border border-[#00F5D4]/30 rounded">
          FEEX // ECOSYSTEM TOPOLOGY ACTIVE
        </span>
      </div>

      <div className="absolute top-4 right-6 z-10 hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-40">
        <span>TOPOLOGY: 6 REPOSITORIES</span>
        <span className="text-gray-20">|</span>
        <span>EVIDENCE: CANONICAL</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={1.5} color="#00F5D4" />
        <pointLight position={[-6, -6, -6]} intensity={1.2} color="#facc15" />

        <Stars radius={40} depth={20} count={350} factor={3} saturation={0} fade speed={1} />
        <DreiSparkles count={30} scale={[10, 4, 10]} size={2} color="#00F5D4" opacity={0.5} />

        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
          <ConnectingLines />
          <TopologyNode position={[-3.2, 0.4, 0]} color="#00F5D4" label="Persona OS" speed={1.1} />
          <TopologyNode position={[0, 0, 0]} color="#facc15" label="FEEX Core" speed={0.9} />
          <TopologyNode position={[3.2, 0.4, 0]} color="#06b6d4" label="Yurrheeler" speed={1.2} />
          <TopologyNode position={[-1.6, -1.2, 0.5]} color="#a855f7" label="KappaXchange" speed={0.8} />
          <TopologyNode position={[1.6, -1.2, 0.5]} color="#38bdf8" label="HoloKai" speed={1.0} />

          {/* Screen-space HUD in 3D center */}
          <Html center distanceFactor={14} className="pointer-events-none select-none">
            <div className="px-2.5 py-1 rounded-full bg-black/80 border border-yellow/60 backdrop-blur-md shadow-[0_0_15px_rgba(250,204,21,0.3)] text-[10px] font-mono tracking-widest text-yellow uppercase whitespace-nowrap">
              Ecosystem Hub
            </div>
          </Html>
        </Float>
      </Canvas>
    </div>
  );
}

export default DreiProjectsHero;
