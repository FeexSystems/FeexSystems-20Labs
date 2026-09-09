import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Trail,
  Edges,
  Stars,
  Sparkles as DreiSparkles,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

// Satellite that orbits in 3D and leaves a luminous Drei Trail
function OrbitingSatellite({
  radius = 4.2,
  speed = 1.4,
  offset = 0,
  trailColor = "#00F5D4",
  meshColor = "#06b6d4",
}: {
  radius?: number;
  speed?: number;
  offset?: number;
  trailColor?: string;
  meshColor?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 2.2) * (radius * 0.35);

    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <Trail
      target={meshRef}
      width={2.2}
      length={8}
      color={trailColor}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color={meshColor} />
      </mesh>
    </Trail>
  );
}

// Central Intelligence Core with Drei Float and glowing Edges
function GatewayCore() {
  const innerRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.x += delta * 0.4;
      innerRef.current.rotation.y += delta * 0.6;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.25;
      outerRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.8}
      floatIntensity={1.4}
      floatingRange={[-0.25, 0.25]}
    >
      <group position={[0, 0, 0]}>
        {/* Inner Octahedron Core with High-Tech Wireframe Edges */}
        <mesh ref={innerRef} scale={1.4}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#090a0f"
            roughness={0.2}
            metalness={0.9}
            wireframe={false}
          />
          <Edges
            threshold={15}
            scale={1.002}
            color="#00F5D4"
            renderOrder={1000}
          />
        </mesh>

        {/* Outer Icosahedron Cryptographic Lattice with Golden Edges */}
        <mesh ref={outerRef} scale={2.2}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#040406"
            wireframe
            transparent
            opacity={0.2}
          />
          <Edges
            threshold={10}
            scale={1.004}
            color="#facc15"
            renderOrder={999}
          />
        </mesh>

        {/* Floating Telemetry Screen Space Annotation */}
        <Html center position={[0, 2.5, 0]} className="pointer-events-none select-none text-center">
          <div className="text-[11px] font-mono font-bold text-[#00F5D4] tracking-widest uppercase bg-[#040406]/90 px-2.5 py-0.5 border border-[#00F5D4]/40 rounded shadow-token-sm backdrop-blur-md">
            FEEX // EDGE GATEWAY
          </div>
          <div className="text-[9px] font-mono text-gray-40 mt-0.5">
            LIVING INTELLIGENCE • ACTIVE 100%
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Interactive Parallax Camera rig
function ParallaxCamera() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 2.5,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      1.2 + state.pointer.y * 1.8,
      0.04
    );
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export function DreiLandingHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 1.2, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ParallaxCamera />

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F5D4" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#facc15" />

        {/* Drei Stars background field */}
        <Stars radius={40} depth={30} count={2200} factor={3} saturation={0.5} fade speed={0.8} />

        {/* Drei Sparkles holographic cyber dust */}
        <DreiSparkles
          count={70}
          scale={[14, 10, 14]}
          size={2.4}
          speed={0.6}
          opacity={0.7}
          color="#06b6d4"
        />

        {/* Central Intelligence Core with Drei Edges and Float */}
        <GatewayCore />

        {/* Dual Orbiting Satellites leaving Drei Trails */}
        <OrbitingSatellite radius={3.6} speed={1.2} offset={0} trailColor="#00F5D4" meshColor="#00F5D4" />
        <OrbitingSatellite radius={4.8} speed={-0.9} offset={Math.PI} trailColor="#facc15" meshColor="#facc15" />
      </Canvas>
    </div>
  );
}
export default DreiLandingHero;
