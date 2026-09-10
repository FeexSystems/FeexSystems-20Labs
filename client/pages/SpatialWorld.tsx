import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CameraControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Sparkles as DreiSparkles,
  Text,
  Float,
  Billboard,
  Trail,
  Html,
  QuadraticBezierLine,
  AdaptiveDpr,
  useCursor,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Boxes,
  Compass,
  ExternalLink,
  FileCode,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
  Activity,
  Globe,
  Cpu,
  Radio,
} from "lucide-react";
import {
  PlanetaryCoreShaderMaterial,
  AtmosphereHalo,
  CryptographicLattice,
  EquatorialTelemetryRing,
  resolveWorldChroma,
} from "@/components/webgl/PlanetaryCoreMaterial";
import { TextScrambleMorph } from "@/components/motion/TextScrambleMorph";
import { CursorDotTrail } from "@/components/framer";

// ─────────────────────────────────────────────────────────────────────
// Types & Interfaces (preserved exactly)
// ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  name: string;
  type: "project" | "technology";
  repository?: string;
  description?: string | null;
  url?: string;
  isPinned?: boolean;
  domain?: string;
  language?: string;
  artifactCount?: number;
  val?: number;
  position?: [number, number, number];
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  relation: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  stats: {
    totalProjects: number;
    totalTechnologies: number;
    totalLinks: number;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Domain Chromas (preserved exactly)
// ─────────────────────────────────────────────────────────────────────

const DOMAIN_COLORS: Record<string, string> = {
  Intelligence: "#10b981",
  Healthcare: "#06b6d4",
  Finance: "#f59e0b",
  Research: "#a855f7",
  Platform: "#3b82f6",
  WorldModels: "#ec4899",
};

function getNodeColor(node: GraphNode): string {
  if (node.type === "technology") return "#6366f1";
  if (node.domain && DOMAIN_COLORS[node.domain]) return DOMAIN_COLORS[node.domain];
  return "#10b981";
}

// ─────────────────────────────────────────────────────────────────────
// Canonical Initial Graph (preserved exactly)
// ─────────────────────────────────────────────────────────────────────

const CANONICAL_INITIAL_GRAPH: GraphData = {
  nodes: [
    {
      id: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      name: "Persona Digital Operating Environment",
      type: "project",
      repository: "FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      description: "A spatial digital environment for exploring the Persona, systems, technologies and engineering relationships.",
      url: "https://github.com/FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio",
      isPinned: true,
      domain: "Intelligence",
      language: "JavaScript",
      artifactCount: 14,
      val: 36,
    },
    {
      id: "github:FeexSystems/yurrheeler-med-advisor",
      name: "Yurrheeler Med Advisor",
      type: "project",
      repository: "FeexSystems/yurrheeler-med-advisor",
      description: "AI-oriented healthcare application and medical-advisor engineering project.",
      url: "https://github.com/FeexSystems/yurrheeler-med-advisor",
      isPinned: true,
      domain: "Healthcare",
      language: "TypeScript",
      artifactCount: 12,
      val: 36,
    },
    {
      id: "github:FeexSystems/kappaxchangefin",
      name: "KappaXchangeFin",
      type: "project",
      repository: "FeexSystems/kappaxchangefin",
      description: "Financial infrastructure project within the FEEXSYSTEMS engineering ecosystem.",
      url: "https://github.com/FeexSystems/kappaxchangefin",
      isPinned: true,
      domain: "Finance",
      language: "TypeScript",
      artifactCount: 10,
      val: 36,
    },
    {
      id: "github:FeexSystems/HoloKai-Systems-Labs",
      name: "HoloKai Systems Labs",
      type: "project",
      repository: "FeexSystems/HoloKai-Systems-Labs",
      description: "Research and systems work exploring civilization intelligence and knowledge interfaces.",
      url: "https://github.com/FeexSystems/HoloKai-Systems-Labs",
      isPinned: false,
      domain: "Research",
      language: "TypeScript",
      artifactCount: 8,
      val: 24,
    },
    {
      id: "github:FeexSystems/VYRA-LABS",
      name: "VYRA Labs",
      type: "project",
      repository: "FeexSystems/VYRA-LABS",
      description: "Experimental systems laboratory within the broader FEEXSYSTEMS ecosystem.",
      url: "https://github.com/FeexSystems/VYRA-LABS",
      isPinned: false,
      domain: "Research",
      language: "TypeScript",
      artifactCount: 8,
      val: 24,
    },
    {
      id: "github:FeexSystems/3WM-SONIK-LABS",
      name: "3WM SONIK Labs",
      type: "project",
      repository: "FeexSystems/3WM-SONIK-LABS",
      description: "Three-world-model research and engineering laboratory.",
      url: "https://github.com/FeexSystems/3WM-SONIK-LABS",
      isPinned: false,
      domain: "Intelligence",
      language: "TypeScript",
      artifactCount: 9,
      val: 24,
    },
    { id: "tech:typescript", name: "TypeScript", type: "technology", val: 16 },
    { id: "tech:threejs", name: "Three.js", type: "technology", val: 14 },
    { id: "tech:react", name: "React", type: "technology", val: 16 },
    { id: "tech:ai", name: "AI", type: "technology", val: 18 },
    { id: "tech:postgresql", name: "PostgreSQL", type: "technology", val: 15 },
    { id: "tech:webgl", name: "WebGL", type: "technology", val: 14 },
    { id: "tech:worldmodels", name: "World Models", type: "technology", val: 16 },
  ],
  links: [
    { id: "rel:1", source: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio", target: "tech:threejs", relation: "USES" },
    { id: "rel:2", source: "github:FeexSystems/FEEXSYSTEMS-Persona-Digital-Portfolio", target: "tech:webgl", relation: "USES" },
    { id: "rel:3", source: "github:FeexSystems/yurrheeler-med-advisor", target: "tech:react", relation: "USES" },
    { id: "rel:4", source: "github:FeexSystems/yurrheeler-med-advisor", target: "tech:ai", relation: "USES" },
    { id: "rel:5", source: "github:FeexSystems/kappaxchangefin", target: "tech:postgresql", relation: "USES" },
    { id: "rel:6", source: "github:FeexSystems/3WM-SONIK-LABS", target: "tech:worldmodels", relation: "USES" },
    { id: "rel:7", source: "github:FeexSystems/3WM-SONIK-LABS", target: "tech:ai", relation: "USES" },
    { id: "rel:8", source: "github:FeexSystems/HoloKai-Systems-Labs", target: "tech:ai", relation: "USES" },
  ],
  stats: {
    totalProjects: 6,
    totalTechnologies: 7,
    totalLinks: 8,
  },
};

// ─────────────────────────────────────────────────────────────────────
// GLSL: Stippled Nebula Environment Particles
// ─────────────────────────────────────────────────────────────────────

const NEBULA_VERTEX = /* glsl */ `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Organic floating drift
    pos.x += sin(uTime * 0.12 + aPhase * 6.28) * 1.8;
    pos.y += cos(uTime * 0.09 + aPhase * 3.14) * 1.2;
    pos.z += sin(uTime * 0.07 + aPhase * 4.71) * 1.5;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * (80.0 / -mvPos.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 6.0);

    float dist = length(mvPos.xyz);
    vAlpha = smoothstep(120.0, 20.0, dist) * (0.3 + 0.7 * aSize / 3.0);
  }
`;

const NEBULA_FRAGMENT = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float strength = 1.0 - smoothstep(0.1, 0.5, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength * vAlpha * 0.6);
  }
`;

function StippledNebulaField({ count = 6000 }: { count?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a large sphere with hollow center
      const r = 15 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.4 + Math.random() * 2.2;
      ph[i] = Math.random();
    }
    return { positions: pos, sizes: sz, phases: ph };
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    []
  );

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={NEBULA_VERTEX}
        fragmentShader={NEBULA_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Selection Shockwave Ring — expands from node on click
// ─────────────────────────────────────────────────────────────────────

function SelectionShockwave({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(1.0);

  useFrame((_, delta) => {
    if (scale < 8) {
      setScale((s) => s + delta * 12);
      setOpacity((o) => Math.max(0, o - delta * 1.8));
    }
  });

  if (opacity <= 0) return null;

  return (
    <mesh ref={ringRef} position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Breathing Node Mesh with Planetary Core + Shockwave
// ─────────────────────────────────────────────────────────────────────

function NodeMesh({
  node,
  isSelected,
  isDimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  node: GraphNode;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const chroma = useMemo(() => resolveWorldChroma(node.name, node.domain), [node]);
  const size = node.type === "project" ? (node.isPinned ? 1.7 : 1.3) : 0.85;
  // Phase offset derived from position for desynchronized breathing
  const phaseOffset = useMemo(() => {
    const p = node.position || [0, 0, 0];
    return (p[0] + p[1] + p[2]) * 0.5;
  }, [node.position]);

  useCursor(isHovered, "pointer", "auto");

  useFrame((state) => {
    if (!meshRef.current) return;
    // Breathing scale pulse — all nodes breathe gently, selected breathe stronger
    const breathe = isSelected
      ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12
      : 1 + Math.sin(state.clock.elapsedTime * 1.2 + phaseOffset) * 0.04;
    meshRef.current.scale.setScalar(breathe);
  });

  const handleClick = useCallback(() => {
    setShowShockwave(true);
    setTimeout(() => setShowShockwave(false), 800);
    onClick();
  }, [onClick]);

  return (
    <group position={node.position || [0, 0, 0]}>
      <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            onPointerOver();
          }}
          onPointerOut={() => {
            setIsHovered(false);
            onPointerOut();
          }}
        >
          <sphereGeometry args={[size, 64, 64]} />
          {node.type === "project" ? (
            <PlanetaryCoreShaderMaterial
              chroma={chroma}
              isSelected={isSelected}
              isDimmed={isDimmed}
            />
          ) : (
            <meshStandardMaterial
              color={chroma.primary}
              emissive={chroma.primary}
              emissiveIntensity={isSelected ? 1.2 : isDimmed ? 0.08 : 0.5}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={isDimmed ? 0.15 : 0.95}
            />
          )}
        </mesh>

        {/* Crystalline Transmission Shell on selected */}
        {isSelected && !isDimmed && (
          <mesh scale={1.25}>
            <sphereGeometry args={[size, 48, 48]} />
            <MeshTransmissionMaterial
              backside
              samples={6}
              thickness={0.3}
              chromaticAberration={0.08}
              anisotropy={0.15}
              distortion={0.2}
              color={chroma.primary}
              roughness={0.08}
              transmission={0.94}
            />
          </mesh>
        )}

        {/* Volumetric Atmospheric Glow */}
        {!isDimmed && node.type === "project" && (
          <AtmosphereHalo
            color={chroma.primary}
            radius={size}
            fresnelPower={isSelected ? 2.2 : 3.5}
          />
        )}

        {/* Cryptographic Wireframe Lattice */}
        {(node.isPinned || isSelected) && !isDimmed && (
          <CryptographicLattice radius={size} color={chroma.accent} />
        )}

        {/* Equatorial Telemetry Ring */}
        {(node.isPinned || isSelected) && !isDimmed && (
          <EquatorialTelemetryRing radius={size} color={chroma.primary} />
        )}

        {/* Billboard Labels */}
        <Billboard follow lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, size + 1.1, 0]}
            fontSize={node.type === "project" ? 0.65 : 0.42}
            maxWidth={9}
            lineHeight={1.1}
            color={isDimmed ? "#475569" : "#f8fafc"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="#000000"
            outlineOpacity={0.95}
          >
            {node.name}
          </Text>
          {node.domain && !isDimmed && (
            <Text
              position={[0, size + 0.55, 0]}
              fontSize={0.26}
              color={chroma.primary}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#000000"
            >
              {node.domain.toUpperCase()}
            </Text>
          )}
        </Billboard>

        {/* Screen-space Focus Badge */}
        {isSelected && (
          <Html center distanceFactor={18} className="pointer-events-none select-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#121212]/95 border border-white/20 text-[9px] font-mono text-white uppercase tracking-widest whitespace-nowrap shadow-2xl backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              <span>FOCUS // {node.domain || "SYSTEM"}</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-400">{node.artifactCount || 0} artifacts</span>
            </div>
          </Html>
        )}
      </Float>

      {/* Selection Shockwave Ring */}
      {showShockwave && node.position && (
        <SelectionShockwave position={[0, 0, 0]} color={chroma.primary} />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Animated Data-Stream Traveling Pulse with Trail
// ─────────────────────────────────────────────────────────────────────

function DataStreamPulse({
  curve,
  color,
  speed = 0.7,
  size = 0.07,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  speed?: number;
  size?: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    curve.getPoint(t, pulseRef.current.position);
  });

  return (
    <Trail
      width={1.8}
      length={8}
      color={color}
      attenuation={(t) => t * t}
      target={pulseRef}
    >
      <mesh ref={pulseRef}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// Secondary reverse-direction pulse for richer data streams
function DataStreamPulseReverse({
  curve,
  color,
  speed = 0.5,
  size = 0.05,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  speed?: number;
  size?: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = 1 - ((clock.getElapsedTime() * speed + 0.5) % 1);
    curve.getPoint(t, pulseRef.current.position);
  });

  return (
    <Trail
      width={1.0}
      length={5}
      color={color}
      attenuation={(t) => t * t * t}
      target={pulseRef}
    >
      <mesh ref={pulseRef}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Enhanced Connection Conduit with dual data streams
// ─────────────────────────────────────────────────────────────────────

function ConnectionLine({
  start,
  end,
  isHighlighted,
  isDimmed,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
  isDimmed: boolean;
}) {
  const lineRef = useRef<any>(null);
  const { mid, curve } = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const dist = p1.distanceTo(p2);
    const m = p1.clone().lerp(p2, 0.5);
    m.y += Math.min(dist * 0.2, 2.5);
    const spline = new THREE.QuadraticBezierCurve3(p1, m, p2);
    return {
      mid: [m.x, m.y, m.z] as [number, number, number],
      curve: spline,
    };
  }, [start, end]);

  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * (isHighlighted ? 5.0 : 2.0);
    }
  });

  return (
    <group>
      <QuadraticBezierLine
        ref={lineRef}
        start={start}
        end={end}
        mid={mid}
        lineWidth={isHighlighted ? 3.5 : 1.4}
        color={isHighlighted ? "#00FFA3" : "#ffffff"}
        dashed
        dashScale={3.0}
        dashSize={1.2}
        gapSize={1.0}
        transparent
        opacity={isHighlighted ? 0.9 : isDimmed ? 0.03 : 0.25}
      />

      {/* Primary data stream pulse */}
      {!isDimmed && (
        <DataStreamPulse
          curve={curve}
          color={isHighlighted ? "#00FFA3" : "#ffffff"}
          speed={isHighlighted ? 1.6 : 0.6}
          size={isHighlighted ? 0.12 : 0.06}
        />
      )}

      {/* Reverse pulse on highlighted edges for bidirectional flow */}
      {isHighlighted && (
        <DataStreamPulseReverse
          curve={curve}
          color="#00F5D4"
          speed={0.9}
          size={0.08}
        />
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Enhanced Holographic Floor with Pulse Emanation Rings
// ─────────────────────────────────────────────────────────────────────

function HolographicFloor() {
  const sweepRef = useRef<THREE.Mesh>(null!);
  const pulseRing1Ref = useRef<THREE.Mesh>(null!);
  const pulseRing2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (sweepRef.current) sweepRef.current.rotation.z -= delta * 0.7;

    // Expanding pulse rings
    const t1 = (state.clock.elapsedTime * 0.4) % 1;
    const t2 = ((state.clock.elapsedTime * 0.4) + 0.5) % 1;

    if (pulseRing1Ref.current) {
      const s = 2 + t1 * 22;
      pulseRing1Ref.current.scale.set(s, s, 1);
      (pulseRing1Ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t1) * 0.25;
    }
    if (pulseRing2Ref.current) {
      const s = 2 + t2 * 22;
      pulseRing2Ref.current.scale.set(s, s, 1);
      (pulseRing2Ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t2) * 0.2;
    }
  });

  return (
    <group position={[0, -9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Reticle */}
      <mesh>
        <ringGeometry args={[19.8, 20.0, 96]} />
        <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Mid Ring */}
      <mesh>
        <ringGeometry args={[9.9, 10.0, 96]} />
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Inner Ring */}
      <mesh>
        <ringGeometry args={[4.9, 5.0, 96]} />
        <meshBasicMaterial color="#ffffff" opacity={0.06} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Expanding Pulse Ring 1 */}
      <mesh ref={pulseRing1Ref}>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.2} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Expanding Pulse Ring 2 */}
      <mesh ref={pulseRing2Ref}>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Sweeping Radar Arc */}
      <mesh ref={sweepRef}>
        <ringGeometry args={[0.5, 20, 48, 1, 0, Math.PI / 5]} />
        <meshBasicMaterial color="#ffffff" opacity={0.04} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Camera Intro Swoop Animation
// ─────────────────────────────────────────────────────────────────────

function CameraIntro({ controlsRef }: { controlsRef: React.RefObject<CameraControls | null> }) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const timer = setTimeout(() => {
      if (controlsRef.current && !hasAnimated.current) {
        hasAnimated.current = true;
        controlsRef.current.setLookAt(0, 14, 30, 0, 0, 0, false);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [controlsRef]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────
// World Scene — main 3D composition
// ─────────────────────────────────────────────────────────────────────

function WorldScene({
  data,
  selectedNode,
  searchQuery,
  domainFilter,
  autoRotate,
  onSelectNode,
}: {
  data: GraphData;
  selectedNode: GraphNode | null;
  searchQuery: string;
  domainFilter: string;
  autoRotate: boolean;
  onSelectNode: (node: GraphNode | null) => void;
}) {
  const cameraControlsRef = useRef<CameraControls>(null);

  // Position nodes radially (preserved)
  const positionedNodes = useMemo(() => {
    const projectNodes = data.nodes.filter((n) => n.type === "project");
    const techNodes = data.nodes.filter((n) => n.type === "technology");

    const nodesWithPos: GraphNode[] = [];
    const radiusProjects = 14;
    const radiusTechs = 8;

    projectNodes.forEach((node, i) => {
      const angle = (i / Math.max(projectNodes.length, 1)) * Math.PI * 2;
      const y = Math.sin(i * 1.7) * 4;
      nodesWithPos.push({
        ...node,
        position: [
          Math.cos(angle) * radiusProjects,
          y,
          Math.sin(angle) * radiusProjects,
        ],
      });
    });

    techNodes.forEach((node, i) => {
      const angle = (i / Math.max(techNodes.length, 1)) * Math.PI * 2 + 0.5;
      const y = Math.cos(i * 1.3) * 3;
      nodesWithPos.push({
        ...node,
        position: [
          Math.cos(angle) * radiusTechs,
          y,
          Math.sin(angle) * radiusTechs,
        ],
      });
    });

    return nodesWithPos;
  }, [data.nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    positionedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [positionedNodes]);

  // Smooth Camera to selected node (preserved)
  useEffect(() => {
    if (selectedNode && selectedNode.position && cameraControlsRef.current) {
      const [x, y, z] = selectedNode.position;
      const dist = selectedNode.type === "project" ? 6 : 4;
      cameraControlsRef.current.setLookAt(x, y + 2, z + dist, x, y, z, true);
    }
  }, [selectedNode]);

  // Cinematic auto-rotate with gentle vertical bob
  useFrame((state, delta) => {
    if (autoRotate && cameraControlsRef.current && !selectedNode) {
      cameraControlsRef.current.azimuthAngle += 0.12 * delta;
    }
  });

  const matchesSearch = (n: GraphNode) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.name.toLowerCase().includes(q) ||
      (n.repository && n.repository.toLowerCase().includes(q)) ||
      (n.domain && n.domain.toLowerCase().includes(q)) ||
      (n.language && n.language.toLowerCase().includes(q))
    );
  };

  const matchesDomain = (n: GraphNode) => {
    if (!domainFilter || domainFilter === "all") return true;
    return n.domain === domainFilter;
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 20, 20]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-20, -15, -20]} intensity={1.2} color="#6366f1" />
      <pointLight position={[0, 30, 0]} intensity={0.8} color="#00F5D4" />

      {/* GPU Stippled Nebula Particle Field */}
      <StippledNebulaField count={6000} />

      {/* Drei Sparkles — close-range luminous motes */}
      <DreiSparkles
        count={120}
        scale={[45, 25, 45]}
        size={2.5}
        speed={0.3}
        opacity={0.5}
        color="#ffffff"
      />

      {/* Cybernetic Grid Floor */}
      <Grid
        position={[0, -9, 0]}
        args={[160, 160]}
        cellSize={2.5}
        cellThickness={0.8}
        cellColor="#1a1a2e"
        sectionSize={10}
        sectionThickness={1.4}
        sectionColor="#ffffff"
        fadeDistance={100}
        fadeStrength={1.5}
        infiniteGrid
        followCamera
      />

      {/* Holographic Floor Radar */}
      <HolographicFloor />

      {/* Connection Lines */}
      {data.links.map((link) => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        if (!sourceNode?.position || !targetNode?.position) return null;

        const isHighlighted =
          Boolean(selectedNode) &&
          (selectedNode?.id === link.source || selectedNode?.id === link.target);
        const isDimmed =
          Boolean(selectedNode) &&
          selectedNode?.id !== link.source &&
          selectedNode?.id !== link.target;

        return (
          <ConnectionLine
            key={link.id}
            start={sourceNode.position}
            end={targetNode.position}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
          />
        );
      })}

      {/* Nodes */}
      {positionedNodes.map((node) => {
        const isSelected = selectedNode?.id === node.id;
        const matches = matchesSearch(node) && matchesDomain(node);
        const isDimmed = !matches || (Boolean(selectedNode) && !isSelected);

        return (
          <NodeMesh
            key={node.id}
            node={node}
            isSelected={isSelected}
            isDimmed={isDimmed}
            onClick={() => onSelectNode(isSelected ? null : node)}
            onPointerOver={() => {}}
            onPointerOut={() => {}}
          />
        );
      })}

      {/* Camera Controls */}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={4}
        maxDistance={60}
        dollySpeed={0.8}
        smoothTime={0.4}
      />

      {/* Camera Intro Swoop */}
      <CameraIntro controlsRef={cameraControlsRef} />

      {/* Orientation Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#ffffff", "#ffffff", "#ffffff"]}
          labelColor="#f8fafc"
        />
      </GizmoHelper>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Galaxy Radar Mini-Map (redesigned)
// ─────────────────────────────────────────────────────────────────────

function GalaxyRadarMiniMap({
  nodes,
  selectedNode,
  onSelectNode,
}: {
  nodes: GraphNode[];
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
}) {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [showScanPulse, setShowScanPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 3) % 360);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // Scan pulse every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowScanPulse(true);
      setTimeout(() => setShowScanPulse(false), 1200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-[#121212]/90 px-3 py-1.5 text-[10px] text-white/60 hover:text-white hover:border-white/30 backdrop-blur-xl transition-colors shadow-xl"
      >
        <Compass className="size-3 text-white animate-spin" style={{ animationDuration: "12s" }} />
        <span>EXPAND RADAR // 360°</span>
      </button>
    );
  }

  return (
    <div className="relative w-48 rounded-[20px] border border-white/10 bg-[#121212]/95 backdrop-blur-2xl p-3 font-mono select-none shadow-2xl transition-all">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px] tracking-wider text-white/50 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white font-bold">GALAXY RADAR</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-white/40 hover:text-white text-[10px] px-1"
          title="Minimize radar"
        >
          ─
        </button>
      </div>

      <div className="relative w-40 h-40 mx-auto rounded-full bg-black/80 border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Concentric range rings */}
        <div className="absolute size-32 rounded-full border border-white/[0.06]" />
        <div className="absolute size-20 rounded-full border border-white/[0.06]" />
        <div className="absolute size-10 rounded-full border border-white/[0.06]" />

        {/* Scan pulse ring */}
        {showScanPulse && (
          <div className="absolute size-2 rounded-full border-2 border-white/40 animate-ping" />
        )}

        {/* Cardinal markers */}
        <span className="absolute top-1 text-[7px] text-white/50 font-bold">N</span>
        <span className="absolute bottom-1 text-[7px] text-white/20 font-bold">S</span>
        <span className="absolute left-1.5 text-[7px] text-white/20 font-bold">W</span>
        <span className="absolute right-1.5 text-[7px] text-white/20 font-bold">E</span>

        {/* Crosshairs */}
        <div className="absolute w-32 h-px bg-white/[0.06]" />
        <div className="absolute h-32 w-px bg-white/[0.06]" />

        {/* Sweeping radar ray */}
        <div
          className="absolute w-18 h-px origin-left pointer-events-none"
          style={{
            transform: `rotate(${sweepAngle}deg)`,
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.7))",
          }}
        />
        {/* Sweep trail */}
        <div
          className="absolute w-18 h-18 origin-bottom-left pointer-events-none opacity-[0.06]"
          style={{
            transform: `rotate(${sweepAngle - 40}deg)`,
            background: "conic-gradient(from 0deg, rgba(255, 255, 255, 0.5) 0deg, transparent 40deg)",
          }}
        />

        {/* Domain-colored Node Blips */}
        {nodes.map((n) => {
          const x = n.position ? n.position[0] : 0;
          const z = n.position ? n.position[2] : 0;
          const left = 50 + (x / 24) * 38;
          const top = 50 + (z / 24) * 38;
          const isSelected = selectedNode?.id === n.id;
          const blipColor = getNodeColor(n);

          return (
            <button
              key={n.id}
              onClick={() => onSelectNode(n)}
              onMouseEnter={() => setHoveredNode(n)}
              onMouseLeave={() => setHoveredNode(null)}
              title={n.name}
              className={`absolute size-2 -ml-1 -mt-1 rounded-full transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-[2] z-30"
                  : n.type === "project"
                  ? "hover:scale-[2] z-20"
                  : "hover:scale-150 z-10 opacity-60"
              }`}
              style={{
                left: `${Math.max(10, Math.min(90, left))}%`,
                top: `${Math.max(10, Math.min(90, top))}%`,
                backgroundColor: isSelected ? "#ffffff" : blipColor,
                boxShadow: isSelected ? `0 0 8px ${blipColor}` : "none",
              }}
            />
          );
        })}
      </div>

      {/* Radar Footer */}
      <div className="mt-2 pt-1.5 border-t border-white/10 text-[9px] text-white/50 flex items-center justify-between">
        <span className="truncate max-w-[110px] text-white">
          {hoveredNode ? hoveredNode.name : selectedNode ? selectedNode.name : "SCANNING"}
        </span>
        <span className="text-white/30 text-[8px]">
          {hoveredNode?.position
            ? `${hoveredNode.position[0].toFixed(0)},${hoveredNode.position[2].toFixed(0)}`
            : "360°"}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Immersive Boot Sequence Loading State
// ─────────────────────────────────────────────────────────────────────

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootLines = [
    "> initializing GLSL planetary cores...",
    "> synthesizing domain-warped shaders...",
    "> mapping knowledge topology graph...",
    "> computing node positions (N=13)...",
    "> establishing edge conduit streams...",
    "> calibrating holographic radar projector...",
    "> enabling bloom post-processing pipeline...",
    "✓ FEEXSYSTEMS SPATIAL WORLD ONLINE",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines((prev) => [...prev, bootLines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 600);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
      <div className="max-w-lg w-full px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <span className="size-3 bg-white rounded-none" />
          <span className="text-white font-mono text-sm font-bold tracking-tight">FEEXSYSTEMS</span>
          <span className="text-white/30 font-mono text-xs">// SPATIAL WORLD</span>
        </div>

        {/* Terminal Lines */}
        <div className="font-mono text-xs space-y-1.5">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`transition-opacity duration-300 ${
                line.startsWith("✓")
                  ? "text-emerald-400 font-bold"
                  : "text-white/60"
              }`}
            >
              {line}
            </div>
          ))}
          {/* Blinking cursor */}
          {lines.length < bootLines.length && (
            <span className="inline-block w-2 h-4 bg-white/70 animate-pulse" />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-px w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(lines.length / bootLines.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Live FPS Counter Hook
// ─────────────────────────────────────────────────────────────────────

function useFpsCounter() {
  const [fps, setFps] = useState(60);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let raf: number;
    const loop = () => {
      frames.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        lastTime.current = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return fps;
}

// ─────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────

export default function SpatialWorld() {
  const [searchParams] = useSearchParams();
  const [graphData, setGraphData] = useState<GraphData>(CANONICAL_INITIAL_GRAPH);
  const [loading, setLoading] = useState(true);
  const [booting, setBooting] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fps = useFpsCounter();

  const loadGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/world-model/graph");
      const json = await res.json();
      if (json.success && json.data) {
        setGraphData(json.data);
      }
    } catch (e) {
      console.warn("Could not fetch live graph, using canonical fallback", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  // Deep-link: /world?focus=<nodeId>
  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (focusId && graphData) {
      const target = graphData.nodes.find(
        (n) => n.id === focusId || n.id === decodeURIComponent(focusId)
      );
      if (target) setSelectedNode(target);
    }
  }, [searchParams, graphData]);

  const domains = useMemo(() => {
    if (!graphData) return [];
    const set = new Set<string>();
    graphData.nodes.forEach((n) => {
      if (n.domain) set.add(n.domain);
    });
    return Array.from(set);
  }, [graphData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#000000] text-white font-mono select-none selection:bg-white selection:text-black">
      {/* Interactive Cursor Trail */}
      <CursorDotTrail dotColor="rgba(0, 245, 212, 0.4)" trailColor="rgba(123, 44, 191, 0.2)" />

      {/* Boot Sequence Overlay */}
      {booting && <BootSequence onComplete={() => setBooting(false)} />}

      {/* ═══════════════ TOP HUD HEADER ═══════════════ */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-5 pointer-events-none">
        {/* Left: Brand + Telemetry */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-3 border border-white/10 bg-[#121212]/90 rounded-[20px] px-4 py-2.5 backdrop-blur-xl shadow-2xl transition hover:border-white/25">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight text-white hover:text-white/80 transition-colors"
            >
              <span className="size-2.5 bg-white rounded-none" />
              <TextScrambleMorph text="FEEXSYSTEMS" className="text-white" speed={25} />
              <span className="text-white/30 text-[10px] hidden sm:inline">// 3D WORLD</span>
            </Link>
            <span className="hidden lg:inline-block rounded-[10px] border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
              v2.4
            </span>
          </div>

          {/* Live Telemetry Strip */}
          <div className="hidden md:flex items-center gap-3 border border-white/10 bg-[#121212]/90 rounded-[20px] px-4 py-2 backdrop-blur-xl shadow-2xl text-[10px] text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70">NODES: {graphData?.nodes.length || 0}</span>
            </span>
            <span className="text-white/15">·</span>
            <span className="text-white/50">EDGES: {graphData?.links.length || 0}</span>
            <span className="text-white/15">·</span>
            <span className={fps > 45 ? "text-emerald-400" : fps > 25 ? "text-amber-400" : "text-red-400"}>
              {fps} FPS
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 pointer-events-auto font-mono text-xs">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`h-9 px-3 rounded-[10px] border transition-colors flex items-center gap-1.5 ${
              autoRotate
                ? "bg-white/10 text-white border-white/30"
                : "bg-[#121212]/90 text-white/60 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            <RotateCw className={`size-3.5 ${autoRotate ? "animate-spin text-white" : ""}`} style={autoRotate ? { animationDuration: "4s" } : undefined} />
            <span className="hidden md:inline">Orbit</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="h-9 px-3 rounded-[10px] bg-[#121212]/90 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
          <Link
            to="/omni"
            className="h-9 px-3 rounded-[10px] bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] hover:bg-[#00f5d4]/20 transition-colors flex items-center gap-1.5"
            title="Open Omni-Command Stage"
          >
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">Omni Stage</span>
          </Link>
          <Link
            to="/projects"
            className="h-9 px-3 rounded-[10px] bg-[#121212]/90 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Boxes className="size-3.5 text-white/60" />
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <Link
            to="/omni"
            className="h-9 px-3 rounded-[10px] bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            title="Launch Omni-Command Stage"
          >
            <Terminal className="size-3.5 text-white/80" />
            <span className="hidden sm:inline">Omni Stage</span>
          </Link>
          <Link
            to="/navigator"
            className="h-9 px-3.5 rounded-[10px] bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="size-3.5" />
            <span>Navigator</span>
          </Link>
        </div>
      </header>

      {/* ═══════════════ SEARCH & FILTER TOOLBAR ═══════════════ */}
      <div className="absolute top-[72px] left-4 md:left-5 z-20 flex flex-col gap-2 pointer-events-auto max-w-sm w-full font-mono text-xs">
        <div className="relative border border-white/10 rounded-[20px] bg-[#121212]/90 backdrop-blur-xl shadow-2xl p-1.5 flex items-center">
          <Search className="size-3.5 text-white/30 ml-3 shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search node // e.g. Persona..."
            className="w-full h-8 bg-transparent pl-2 pr-8 text-xs text-white placeholder:text-white/30 focus:outline-none font-mono caret-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Domain Filter Chips with signal bars */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            onClick={() => setDomainFilter("all")}
            className={`px-3 py-1 rounded-[10px] text-[11px] font-mono border transition-all ${
              domainFilter === "all"
                ? "bg-white text-black font-bold border-white shadow-sm"
                : "bg-[#121212]/90 text-white/60 border-white/10 hover:text-white hover:border-white/25"
            }`}
          >
            All Systems
          </button>
          {domains.map((dom) => {
            const domCount = graphData?.nodes.filter((n) => n.domain === dom).length || 0;
            return (
              <button
                key={dom}
                onClick={() => setDomainFilter(dom)}
                className={`px-3 py-1 rounded-[10px] text-[11px] font-mono border transition-all flex items-center gap-1.5 ${
                  domainFilter === dom
                    ? "bg-white text-black font-bold border-white shadow-sm"
                    : "bg-[#121212]/90 text-white/60 border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: DOMAIN_COLORS[dom] || "#ffffff" }}
                />
                <span>{dom}</span>
                <span className={`text-[9px] ${domainFilter === dom ? "text-black/50" : "text-white/30"}`}>
                  {domCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ 3D WEBGL CANVAS ═══════════════ */}
      <div className="absolute inset-0 z-0">
        {graphData ? (
          <Canvas
            camera={{ position: [0, 14, 30], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <AdaptiveDpr pixelated={false} />
            <Suspense fallback={null}>
              <WorldScene
                data={graphData}
                selectedNode={selectedNode}
                searchQuery={searchQuery}
                domainFilter={domainFilter}
                autoRotate={autoRotate}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center font-mono">
              <RefreshCw className="size-8 animate-spin text-white/40 mx-auto mb-3" />
              <p className="text-white/30 text-xs">Synthesizing GLSL Planetary Cores...</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════ BOTTOM HUD + RADAR ═══════════════ */}
      <div className="absolute bottom-6 left-5 z-20 hidden md:flex flex-col gap-3 pointer-events-auto font-mono">
        {/* Galaxy Radar Mini-Map */}
        <GalaxyRadarMiniMap
          nodes={graphData?.nodes || []}
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
        />

        {/* Bottom Stats HUD */}
        <div className="flex items-center gap-5 rounded-[20px] border border-white/10 bg-[#121212]/90 px-5 py-3 text-xs backdrop-blur-xl shadow-2xl">
          <div>
            <span className="text-white/30 text-[10px] uppercase block">// WORLDS</span>
            <span className="text-sm font-bold text-white">
              {graphData?.stats.totalProjects || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-white/30 text-[10px] uppercase block">// TECH</span>
            <span className="text-sm font-bold text-white">
              {graphData?.stats.totalTechnologies || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-white/30 text-[10px] uppercase block">// EDGES</span>
            <span className="text-sm font-bold text-white">
              {graphData?.stats.totalLinks || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] text-white/50 border border-white/10 rounded-[10px] bg-white/[0.03] px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            <span>FEEX SPATIAL GALAXY // 3D TOPOLOGY</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ NODE INSPECTOR DRAWER ═══════════════ */}
      {selectedNode && (
        <aside className="absolute right-0 top-0 bottom-0 z-30 w-full max-w-md border-l border-white/10 bg-[#121212]/95 shadow-2xl backdrop-blur-3xl overflow-y-auto font-mono text-xs animate-in slide-in-from-right duration-300">
          {/* Inspector Header */}
          <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-xl border-b border-white/10 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-[10px] flex items-center justify-center font-bold border border-white/15 bg-black text-white">
                  {selectedNode.type === "project" ? (
                    <Boxes className="size-5" />
                  ) : (
                    <Layers className="size-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">
                      {resolveWorldChroma(selectedNode.name, selectedNode.domain).tag || "WORLD_ENTITY"}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                    {selectedNode.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 text-white/40 hover:bg-white/10 rounded-[8px] hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Provenance SHA Badge with TextScrambleMorph */}
            <div className="rounded-[10px] border border-white/10 bg-black/60 px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">// PROVENANCE</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3 text-emerald-400" />
                <TextScrambleMorph
                  text={selectedNode.id ? `sha-${selectedNode.id.substring(0, 12)}` : "sha-canonical"}
                  className="text-[11px] text-white font-semibold"
                  speed={20}
                />
              </div>
            </div>

            {/* Domain + Language Grid */}
            {selectedNode.type === "project" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[10px] border border-white/10 bg-black/60 p-3.5">
                    <span className="text-[10px] uppercase text-white/30 block">Domain</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: DOMAIN_COLORS[selectedNode.domain || ""] || "#ffffff" }}
                      />
                      <span className="text-xs font-semibold text-white">
                        {selectedNode.domain || "Engineering"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-white/10 bg-black/60 p-3.5">
                    <span className="text-[10px] uppercase text-white/30 block">Language</span>
                    <span className="text-xs font-semibold text-white mt-1.5 block">
                      {selectedNode.language || "TypeScript"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[10px] border border-white/10 bg-black/60 p-3.5">
                    <span className="text-[10px] uppercase text-white/30 block">Artifacts</span>
                    <span className="text-lg font-bold text-white mt-1 block">
                      {selectedNode.artifactCount || 0}
                    </span>
                  </div>
                  <div className="rounded-[10px] border border-white/10 bg-black/60 p-3.5">
                    <span className="text-[10px] uppercase text-white/30 block">Status</span>
                    <span className="text-xs font-semibold text-emerald-400 mt-1.5 block flex items-center gap-1.5">
                      <Activity className="size-3" />
                      ACTIVE
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            {selectedNode.description && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
                  // Observed Description
                </h4>
                <p className="text-xs text-white/70 leading-relaxed rounded-[10px] bg-black/60 p-4 border border-white/10">
                  {selectedNode.description}
                </p>
              </div>
            )}

            {/* Repository */}
            {selectedNode.repository && (
              <div className="rounded-[10px] border border-white/10 bg-black/60 p-4">
                <div className="flex items-center justify-between text-[10px] text-white/30 mb-1.5">
                  <span>Repository Provenance</span>
                  <ShieldCheck className="size-3 text-white/60" />
                </div>
                <div className="font-mono text-xs text-white font-semibold break-all">
                  {selectedNode.repository}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 space-y-2.5">
              {selectedNode.type === "project" && (
                <Link
                  to={`/evidence/${encodeURIComponent(selectedNode.id || selectedNode.name)}`}
                  className="w-full h-10 rounded-[10px] border border-white/15 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-colors font-semibold"
                >
                  <FileCode className="size-4 text-white/80" />
                  <span>Inspect Evidence Provenance</span>
                </Link>
              )}
              {selectedNode.url && (
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-10 rounded-[10px] bg-white hover:bg-white/90 text-black font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Inspect GitHub Source</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              <Link
                to={`/navigator?q=${encodeURIComponent(selectedNode.name)}`}
                className="w-full h-10 rounded-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="size-4 text-white/80" />
                <span>Query in AI Navigator</span>
              </Link>
              <Link
                to={`/omni?q=${encodeURIComponent(`Show me ${selectedNode.name} architecture and evidence`)}`}
                className="w-full h-10 rounded-[10px] border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Terminal className="size-4 text-white/80" />
                <span>Command in Omni Stage</span>
              </Link>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
