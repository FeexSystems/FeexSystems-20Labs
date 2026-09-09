import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Edges, Billboard, Text, Sparkles as DreiSparkles, useCursor, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface GatewayNodeProps {
  position: [number, number, number];
  name: string;
  latency: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

function GatewayNode({
  position,
  name,
  latency,
  color,
  isActive,
  onClick,
}: GatewayNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Declarative cursor control via Drei
  useCursor(hovered, "pointer", "auto");

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * (isActive ? 0.8 : 0.3);
      meshRef.current.rotation.y += delta * (isActive ? 1.0 : 0.4);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={isActive ? 1.15 : hovered ? 1.05 : 0.9}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={isActive ? "#090a0f" : "#040406"}
          roughness={0.2}
          metalness={0.8}
        />
        <Edges
          threshold={15}
          scale={1.002}
          color={isActive ? color : hovered ? "#00F5D4" : "#464850"}
          renderOrder={1000}
        />
      </mesh>

      <Billboard position={[0, 1.3, 0]}>
        <Text
          fontSize={0.22}
          color={isActive ? color : "#d1d1d6"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#040406"
        >
          {name}
        </Text>
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.16}
          color={isActive ? "#00FFA3" : "#9496a0"}
          anchorX="center"
          anchorY="middle"
        >
          {latency}
        </Text>
      </Billboard>
    </group>
  );
}

function CentralRouter() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.7;
      coreRef.current.rotation.z += delta * 0.3;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.4;
      shellRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group scale={0.8}>
      {/* Glowing Inner Neural Core */}
      <mesh ref={coreRef} scale={0.65}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#00F5D4"
          emissive="#00F5D4"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
        <Edges color="#facc15" threshold={10} />
      </mesh>

      {/* Refractive Frosted Transmission Shell */}
      <mesh ref={shellRef} scale={1.1}>
        <dodecahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.25}
          chromaticAberration={0.08}
          anisotropy={0.2}
          distortion={0.2}
          distortionScale={0.3}
          color="#00F5D4"
          roughness={0.1}
          transmission={0.94}
        />
        <Edges color="#00F5D4" threshold={15} />
      </mesh>
    </group>
  );
}

function TelemetryMonitorScreen({ region }: { region: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasObj = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    canvasRef.current = c;
    const tex = new THREE.CanvasTexture(c);
    return { canvas: c, texture: tex };
  }, []);

  useFrame(({ clock }) => {
    const ctx = canvasObj.canvas.getContext("2d");
    if (!ctx) return;
    const t = clock.getElapsedTime();

    // Dark cyber background
    ctx.fillStyle = "#040406";
    ctx.fillRect(0, 0, 512, 256);

    // Subtle Grid
    ctx.strokeStyle = "rgba(0, 245, 212, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Telemetry Oscilloscope Waveform
    ctx.strokeStyle = "#00F5D4";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < 512; x++) {
      const y = 140 + Math.sin(x * 0.04 + t * 4) * 35 + Math.sin(x * 0.08 - t * 6) * 15;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Telemetry Info Header
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`GATEWAY STREAM // ${region.toUpperCase()}`, 16, 32);

    ctx.fillStyle = "#00FFA3";
    ctx.font = "12px monospace";
    ctx.fillText(`PACKETS: ${Math.floor(12450 + (t * 80) % 5000)} PKT/S`, 16, 56);
    ctx.fillText(`HMAC: sha256-verified-live`, 16, 76);

    canvasObj.texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, -1.35, 0.9]} rotation={[-0.45, 0, 0]}>
      <planeGeometry args={[2.8, 1.4]} />
      <meshBasicMaterial map={canvasObj.texture} toneMapped={false} />
      <Edges color="#00F5D4" threshold={15} />
    </mesh>
  );
}

export function DreiGatewayInspector({
  activeRegion = "us-east",
  onSelectRegion,
  className = "",
}: {
  activeRegion?: string;
  onSelectRegion?: (region: string) => void;
  className?: string;
}) {
  const [selected, setSelected] = useState(activeRegion);

  const handleSelect = (reg: string) => {
    setSelected(reg);
    if (onSelectRegion) onSelectRegion(reg);
  };

  return (
    <div className={`relative h-64 w-full rounded-lg overflow-hidden border border-gray-20 bg-[#040406] ${className}`}>
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#00F5D4] animate-pulse" />
        <span className="text-[11px] font-mono tracking-wider text-gray-60 uppercase">
          FEEX 3D GATEWAY ROUTER // REGION: {selected.toUpperCase()}
        </span>
      </div>

      <Canvas camera={{ position: [0, 2.5, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#00F5D4" />
        <pointLight position={[-5, -5, -5]} intensity={1.0} color="#facc15" />

        <DreiSparkles count={40} scale={[8, 5, 8]} size={2} color="#00F5D4" opacity={0.6} />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          <CentralRouter />

          <TelemetryMonitorScreen region={selected} />

          <GatewayNode
            position={[-2.4, 0, 0]}
            name="US-East"
            latency="12.4ms"
            color="#00F5D4"
            isActive={selected === "us-east"}
            onClick={() => handleSelect("us-east")}
          />

          <GatewayNode
            position={[0, 0, -1.8]}
            name="EU-Central"
            latency="18.2ms"
            color="#facc15"
            isActive={selected === "eu-central"}
            onClick={() => handleSelect("eu-central")}
          />

          <GatewayNode
            position={[2.4, 0, 0]}
            name="AP-East"
            latency="24.8ms"
            color="#06b6d4"
            isActive={selected === "ap-east"}
            onClick={() => handleSelect("ap-east")}
          />
        </Float>
      </Canvas>

      <div className="absolute bottom-2.5 right-3 z-10 text-[10px] font-mono text-gray-60">
        Click node to switch active gateway
      </div>
    </div>
  );
}
export default DreiGatewayInspector;
