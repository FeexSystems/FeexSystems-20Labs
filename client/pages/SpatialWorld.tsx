import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Stars,
  Sparkles as DreiSparkles,
  Text,
  Float,
  Billboard,
  Trail,
  Html,
  CatmullRomLine,
  QuadraticBezierLine,
  AdaptiveDpr,
  Bvh,
  useCursor,
  MeshTransmissionMaterial,
  Preload,
  useFBO,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Boxes,
  Compass,
  ExternalLink,
  FileCode,
  Filter,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlanetaryCoreShaderMaterial,
  AtmosphereHalo,
  CryptographicLattice,
  EquatorialTelemetryRing,
  resolveWorldChroma,
} from "@/components/webgl/PlanetaryCoreMaterial";
import { FeexMasterMark, FeexHorizontalLockup, FeexWorldBadge } from "@/components/FeexLogo";

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

const DOMAIN_COLORS: Record<string, string> = {
  Intelligence: "#10b981", // emerald
  Healthcare: "#06b6d4", // cyan
  Finance: "#f59e0b", // amber
  Research: "#a855f7", // purple
  Platform: "#3b82f6", // blue
  WorldModels: "#ec4899", // pink
};

function getNodeColor(node: GraphNode): string {
  if (node.type === "technology") return "#6366f1"; // indigo
  if (node.domain && DOMAIN_COLORS[node.domain]) return DOMAIN_COLORS[node.domain];
  return "#10b981";
}

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

// 3D Node Sphere with Procedural GLSL Planetary Core Shaders + Drei Edges & Outlines
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
  const chroma = useMemo(() => resolveWorldChroma(node.name, node.domain), [node]);
  const size = node.type === "project" ? (node.isPinned ? 1.7 : 1.3) : 0.85;

  // Drei useCursor declarative cursor control
  useCursor(isHovered, "pointer", "auto");

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={node.position || [0, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
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
              emissiveIntensity={isSelected ? 0.9 : isDimmed ? 0.1 : 0.45}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={isDimmed ? 0.2 : 0.95}
            />
          )}
        </mesh>

        {/* Drei Refractive Frosted Transmission Shell on Selected Worlds */}
        {isSelected && !isDimmed && (
          <mesh scale={1.2}>
            <sphereGeometry args={[size, 32, 32]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.22}
              chromaticAberration={0.06}
              anisotropy={0.12}
              distortion={0.15}
              color={chroma.primary}
              roughness={0.12}
              transmission={0.92}
            />
          </mesh>
        )}

        {/* Volumetric Atmospheric Glow Halo */}
        {!isDimmed && node.type === "project" && (
          <AtmosphereHalo
            color={chroma.primary}
            radius={size}
            fresnelPower={isSelected ? 2.5 : 3.2}
          />
        )}

        {/* Cryptographic Wireframe Lattice for Pinned or Selected Worlds */}
        {(node.isPinned || isSelected) && !isDimmed && (
          <CryptographicLattice radius={size} color={chroma.accent} />
        )}

        {/* Equatorial Telemetry Orbit Ring */}
        {(node.isPinned || isSelected) && !isDimmed && (
          <EquatorialTelemetryRing radius={size} color={chroma.primary} />
        )}

        {/* Billboard Text Labels with Dynamic Typography & Domain Tags */}
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, size + 1.1, 0]}
            fontSize={node.type === "project" ? 0.7 : 0.45}
            maxWidth={9}
            lineHeight={1.1}
            color={isDimmed ? "#64748b" : "#f8fafc"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.08}
            outlineColor="#030508"
            outlineOpacity={0.9}
          >
            {node.name}
          </Text>
          {node.domain && !isDimmed && (
            <Text
              position={[0, size + 0.6, 0]}
              fontSize={0.28}
              color={chroma.primary}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#030508"
            >
              {node.domain.toUpperCase()}
            </Text>
          )}
        </Billboard>

        {/* Drei Screen-Space Vector Badge on Focused/Selected World */}
        {isSelected && (
          <Html center distanceFactor={18} className="pointer-events-none select-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#040406]/90 border border-[#00F5D4] text-[9px] font-mono text-[#00F5D4] uppercase tracking-widest whitespace-nowrap shadow-[0_0_15px_rgba(0,245,212,0.4)]">
              <span className="size-1.5 rounded-full bg-[#00F5D4] animate-ping" />
              FOCUS NODE // {node.domain || "SYSTEM"}
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

// Animated Traveling Telemetry Pulse along Arched Spline Conduits with Drei Trail
function AnimatedPulseSphere({
  curve,
  color,
  speed = 0.7,
  size = 0.08,
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
      width={1.4}
      length={7}
      color={color}
      attenuation={(t) => t * t}
      target={pulseRef}
    >
      <mesh ref={pulseRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// 3D Arched Conduits with Drei QuadraticBezierLine and Dynamic Telemetry Pulses
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
    // Lift midpoint along Y-axis to form elegant arched conduit
    const m = p1.clone().lerp(p2, 0.5);
    m.y += Math.min(dist * 0.16, 1.8);
    const spline = new THREE.QuadraticBezierCurve3(p1, m, p2);
    return {
      mid: [m.x, m.y, m.z] as [number, number, number],
      curve: spline,
    };
  }, [start, end]);

  // Animate dash offset for streaming energetic beam flow
  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * (isHighlighted ? 4.5 : 1.8);
    }
  });

  return (
    <group>
      <QuadraticBezierLine
        ref={lineRef}
        start={start}
        end={end}
        mid={mid}
        lineWidth={isHighlighted ? 3.0 : 1.6}
        color={isHighlighted ? "#00FFA3" : "#00B4D8"}
        dashed={true}
        dashScale={2.5}
        dashSize={1.4}
        gapSize={0.8}
        transparent
        opacity={isHighlighted ? 0.95 : isDimmed ? 0.05 : 0.45}
      />
      {/* Streaming telemetry pulse traveling along the arched conduit */}
      {!isDimmed && (
        <AnimatedPulseSphere
          curve={curve}
          color={isHighlighted ? "#00FFA3" : "#00F5D4"}
          speed={isHighlighted ? 1.4 : 0.65}
          size={isHighlighted ? 0.12 : 0.07}
        />
      )}
    </group>
  );
}

// 3D Holographic Floor Radar Projector using Drei useFBO
function HolographicFloorRadar() {
  const radarTarget = useFBO(256, 256);
  const sweepRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.z -= delta * 0.9;
    }
  });

  return (
    <group position={[0, -8.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Tactical Reticle Ring */}
      <mesh>
        <ringGeometry args={[19.8, 20.0, 64]} />
        <meshBasicMaterial color="#00F5D4" opacity={0.35} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Mid Ring */}
      <mesh>
        <ringGeometry args={[9.9, 10.0, 64]} />
        <meshBasicMaterial color="#00F5D4" opacity={0.2} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Target FBO Projection Surface */}
      <mesh>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial map={radarTarget.texture} color="#00F5D4" opacity={0.05} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Sweeping Radar Arc */}
      <mesh ref={sweepRef}>
        <ringGeometry args={[0.5, 20, 32, 1, 0, Math.PI / 4]} />
        <meshBasicMaterial color="#00F5D4" opacity={0.09} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Spatial Scene graph layout with CameraControls, Infinite Cybernetic Grid, and GizmoViewport
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

  // Position nodes radially in 3D space
  const positionedNodes = useMemo(() => {
    const projectNodes = data.nodes.filter((n) => n.type === "project");
    const techNodes = data.nodes.filter((n) => n.type === "technology");

    const nodesWithPos: GraphNode[] = [];
    const radiusProjects = 14;
    const radiusTechs = 8;

    // Distribute project nodes in an outer ring with varying Y
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

    // Distribute technology nodes in an inner cluster
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

  // Smooth Camera transition when a node is selected
  useEffect(() => {
    if (selectedNode && selectedNode.position && cameraControlsRef.current) {
      const [x, y, z] = selectedNode.position;
      const dist = selectedNode.type === "project" ? 6 : 4;
      cameraControlsRef.current.setLookAt(
        x,
        y + 2,
        z + dist,
        x,
        y,
        z,
        true // animated transition
      );
    }
  }, [selectedNode]);

  // Handle auto-rotate via azimuthAngle in useFrame
  useFrame((_, delta) => {
    if (autoRotate && cameraControlsRef.current && !selectedNode) {
      cameraControlsRef.current.azimuthAngle += 0.15 * delta;
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
      <ambientLight intensity={0.6} />
      <pointLight position={[20, 20, 20]} intensity={1.5} />
      <pointLight position={[-20, -20, -20]} intensity={0.8} color="#06b6d4" />
      <Stars radius={120} depth={60} count={5000} factor={4} saturation={0.6} fade speed={0.8} />

      {/* Drei Sparkles: Holographic Cyber Particles throughout Spatial Void */}
      <DreiSparkles
        count={160}
        scale={[50, 25, 50]}
        size={3.5}
        speed={0.4}
        opacity={0.65}
        color="#00F5D4"
      />

      {/* Cybernetic Infinite Coordinate Grid */}
      <Grid
        position={[0, -9, 0]}
        args={[160, 160]}
        cellSize={2.5}
        cellThickness={1.0}
        cellColor="#1E293B"
        sectionSize={10}
        sectionThickness={1.8}
        sectionColor="#00F5D4"
        fadeDistance={140}
        fadeStrength={1.2}
        infiniteGrid
        followCamera
      />

      {/* Holographic Tactical Floor Radar Projector */}
      <HolographicFloorRadar />

      {/* Connection Links */}
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

      {/* Accelerated Raycasting Bvh for Instant Hover/Click Detection */}
      <Bvh firstHitOnly>
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
      </Bvh>

      {/* Production Drei CameraControls with smooth damping */}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={4}
        maxDistance={60}
        dollySpeed={0.8}
        smoothTime={0.35}
      />

      {/* Drei Gizmo Orientation Viewport */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#00F5D4", "#00FFA3", "#7B2CBF"]}
          labelColor="#f8fafc"
        />
      </GizmoHelper>
    </>
  );
}

// 2D Top-Down Galaxy Radar Mini-Map
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

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 3.5) % 360);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 border border-gray-20 bg-[#090a0f]/90 px-3 py-1.5 text-[10px] text-gray-40 hover:text-[#00F5D4] hover:border-[#00F5D4]/40 backdrop-blur-xl transition-colors shadow-token-md"
      >
        <Compass className="size-3 text-[#00F5D4] animate-spin" style={{ animationDuration: "12s" }} />
        <span>EXPAND RADAR</span>
      </button>
    );
  }

  return (
    <div className="relative w-48 border border-gray-20 bg-[#090a0f]/95 backdrop-blur-2xl p-2.5 font-mono select-none shadow-2xl transition-all">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-20/60 text-[9px] tracking-wider text-gray-40 uppercase">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#00F5D4] animate-ping" />
          <span className="text-[#00F5D4] font-bold">GALAXY RADAR</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-40 hover:text-white text-[10px] px-1"
          title="Minimize radar"
        >
          ─
        </button>
      </div>

      <div className="relative w-44 h-44 mx-auto rounded-full bg-black/60 border border-[#00F5D4]/30 overflow-hidden flex items-center justify-center">
        {/* Radar concentric range rings */}
        <div className="absolute size-36 rounded-full border border-cyan-500/20" />
        <div className="absolute size-24 rounded-full border border-cyan-500/25" />
        <div className="absolute size-12 rounded-full border border-cyan-500/30" />

        {/* Cardinal Markers */}
        <span className="absolute top-1 text-[8px] text-[#00F5D4]/60 font-bold">N</span>
        <span className="absolute bottom-1 text-[8px] text-gray-40 font-bold">S</span>
        <span className="absolute left-1.5 text-[8px] text-gray-40 font-bold">W</span>
        <span className="absolute right-1.5 text-[8px] text-gray-40 font-bold">E</span>

        {/* Radar crosshairs */}
        <div className="absolute w-36 h-px bg-cyan-500/20" />
        <div className="absolute h-36 w-px bg-cyan-500/20" />

        {/* Sweeping radar scanner ray */}
        <div
          className="absolute w-20 h-px origin-left bg-gradient-to-r from-transparent to-[#00F5D4] pointer-events-none opacity-90 shadow-[0_0_8px_#00F5D4]"
          style={{ transform: `rotate(${sweepAngle}deg)` }}
        />
        {/* Radar sweep sector faint trail */}
        <div
          className="absolute w-20 h-20 origin-bottom-left pointer-events-none opacity-15"
          style={{
            transform: `rotate(${sweepAngle - 45}deg)`,
            background: "conic-gradient(from 0deg, rgba(0, 245, 212, 0.4) 0deg, transparent 45deg)",
          }}
        />

        {/* Projected Node Blips */}
        {nodes.map((n) => {
          const x = n.position ? n.position[0] : 0;
          const z = n.position ? n.position[2] : 0;
          // Map [-20, 20] range to [12%, 88%]
          const left = 50 + (x / 24) * 38;
          const top = 50 + (z / 24) * 38;
          const isSelected = selectedNode?.id === n.id;
          const chroma = resolveWorldChroma(n.name, n.domain);

          return (
            <button
              key={n.id}
              onClick={() => onSelectNode(n)}
              onMouseEnter={() => setHoveredNode(n)}
              onMouseLeave={() => setHoveredNode(null)}
              title={n.name}
              className={`absolute size-2 -ml-1 -mt-1 rounded-full transition-all cursor-pointer ${
                isSelected
                  ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-150 z-30 animate-pulse"
                  : n.type === "project"
                  ? "hover:scale-150 z-20"
                  : "hover:scale-125 z-10 opacity-75"
              }`}
              style={{
                backgroundColor: isSelected ? "#00FFA3" : chroma.primary,
                left: `${Math.max(10, Math.min(90, left))}%`,
                top: `${Math.max(10, Math.min(90, top))}%`,
                boxShadow: isSelected ? `0 0 6px ${chroma.primary}` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Target Info or Coordinates Footer */}
      <div className="mt-2 pt-1.5 border-t border-gray-20/60 text-[9px] text-gray-40 flex items-center justify-between">
        <span className="truncate max-w-[110px] text-white">
          {hoveredNode ? hoveredNode.name : selectedNode ? selectedNode.name : "ACQ: ACTIVE"}
        </span>
        <span className="text-[#00F5D4] text-[8px]">
          {hoveredNode?.position
            ? `${hoveredNode.position[0].toFixed(0)},${hoveredNode.position[2].toFixed(0)}`
            : "360°"}
        </span>
      </div>
    </div>
  );
}

export default function SpatialWorld() {
  const [graphData, setGraphData] = useState<GraphData>(CANONICAL_INITIAL_GRAPH);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/world-model/graph");
      const json = await res.json();
      if (json.success && json.data) {
        setGraphData(json.data);
      }
    } catch (e) {
      console.warn("Could not fetch live graph, using fallback", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

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
    <div className="relative h-screen w-screen overflow-hidden bg-[#040406] text-white select-none">
      {/* Structural Industrial Wireframe Cross-Hatch Depth */}
      <div className="bg-diagonal-stripes absolute inset-0 z-10 opacity-10 pointer-events-none" />

      {/* Top Floating HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-3 border border-gray-20 bg-[#090a0f]/90 px-4 py-2 text-sm font-semibold backdrop-blur-xl shadow-token-md transition hover:border-[#00F5D4]/50 hover:bg-[#090a0f]"
          >
            <FeexHorizontalLockup markSize={24} showSubtitle={false} />
            <span className="text-gray-40 font-mono">/</span>
            <span className="text-[#00F5D4] font-mono text-xs tracking-wider uppercase">
              SPATIAL_GALAXY_3D
            </span>
          </Link>
          <FeexWorldBadge
            sha="sha-feex-spatial"
            status="ACTIVE 100%"
            className="hidden lg:inline-flex"
          />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto font-mono text-xs">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`h-9 px-3 border transition-colors flex items-center gap-1.5 ${
              autoRotate 
                ? "bg-[#090a0f] text-[#00F5D4] border-[#00F5D4]/60" 
                : "bg-[#090a0f] text-gray-40 border-gray-20 hover:text-white"
            }`}
          >
            <RotateCw className={`size-3.5 ${autoRotate ? "animate-spin text-[#00F5D4]" : ""}`} />
            <span className="hidden md:inline">Orbit</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="h-9 px-3 bg-[#090a0f] border border-gray-20 text-gray-40 hover:text-white transition-colors flex items-center justify-center"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
          <Link
            to="/projects"
            className="h-9 px-3 bg-[#090a0f] border border-gray-20 text-gray-40 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Boxes className="size-3.5 text-yellow" />
            <span className="hidden sm:inline">Projects</span>
          </Link>
          <Link
            to="/navigator"
            className="h-9 px-3.5 bg-white text-black font-semibold hover:bg-gray-90 transition-colors flex items-center gap-1.5"
          >
            <Compass className="size-3.5" />
            <span>Navigator</span>
          </Link>
        </div>
      </header>

      {/* Search & Filter Toolbar */}
      <div className="absolute top-20 left-4 md:left-6 z-20 flex flex-col gap-2 pointer-events-auto max-w-sm w-full font-mono text-xs">
        <div className="relative border border-gray-20 bg-[#090a0f]/90">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search node // e.g. Persona..."
            className="w-full h-10 bg-transparent pl-9 pr-8 text-xs text-white placeholder:text-gray-60 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-40 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Domain Filter Chips */}
        <div className="flex flex-wrap gap-1 pt-1">
          <button
            onClick={() => setDomainFilter("all")}
            className={`px-2.5 py-1 text-[11px] border transition-all ${
              domainFilter === "all"
                ? "bg-white text-black font-bold border-white"
                : "bg-[#090a0f]/80 text-gray-40 border-gray-20 hover:text-white"
            }`}
          >
            All Systems
          </button>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setDomainFilter(dom)}
              className={`px-2.5 py-1 text-[11px] border transition-all ${
                domainFilter === dom
                  ? "bg-[#00F5D4] text-black font-bold border-[#00F5D4]"
                  : "bg-[#090a0f]/80 text-gray-40 border-gray-20 hover:text-white"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        {graphData ? (
          <>
            <Canvas
              camera={{ position: [0, 10, 28], fov: 55 }}
              gl={{ antialias: true, alpha: true }}
            >
              <AdaptiveDpr pixelated />
              <Suspense fallback={null}>
                <WorldScene
                  data={graphData}
                  selectedNode={selectedNode}
                  searchQuery={searchQuery}
                  domainFilter={domainFilter}
                  autoRotate={autoRotate}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
                <Preload all />
              </Suspense>
            </Canvas>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center font-mono">
              <RefreshCw className="size-8 animate-spin text-[#00F5D4] mx-auto mb-3" />
              <p className="text-gray-40 text-xs">Synthesizing GLSL Planetary Cores...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Control HUD & Radar Mini-Map */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex flex-col gap-3 pointer-events-auto font-mono">
        {/* Galaxy Radar Mini-Map */}
        <GalaxyRadarMiniMap
          nodes={graphData?.nodes || []}
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
        />

        {/* Bottom Stats HUD */}
        <div className="flex items-center gap-6 border border-gray-20 bg-[#090a0f]/90 px-5 py-3 text-xs backdrop-blur-xl shadow-token-md">
          <div>
            <span className="text-gray-40 text-[10px] uppercase block">Projects / Worlds</span>
            <span className="text-sm font-bold text-[#00F5D4]">
              {graphData?.stats.totalProjects || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-gray-20" />
          <div>
            <span className="text-gray-40 text-[10px] uppercase block">Technologies</span>
            <span className="text-sm font-bold text-yellow">
              {graphData?.stats.totalTechnologies || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-gray-20" />
          <div>
            <span className="text-gray-40 text-[10px] uppercase block">Graph Edges</span>
            <span className="text-sm font-bold text-white">
              {graphData?.stats.totalLinks || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-gray-20" />
          <div className="flex items-center gap-1.5 text-[10px] text-[#00F5D4] bg-[#00F5D4]/10 px-2.5 py-1 border border-[#00F5D4]/30">
            <Sparkles className="size-3 text-[#00F5D4] animate-pulse" />
            <span>FEEX SPATIAL GALAXY // LIVING WORLD MODEL 3D // 60 FPS</span>
          </div>
        </div>
      </div>

      {/* Slide-over Node Inspector Drawer */}
      {selectedNode && (
        <aside className="absolute right-0 top-0 bottom-0 z-30 w-full max-w-md border-l border-gray-20 bg-[#090a0f]/95 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto font-mono text-xs animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between pb-4 border-b border-gray-20">
            <div className="flex items-center gap-3">
              <div
                className="size-10 flex items-center justify-center font-bold border bg-black"
                style={{
                  borderColor: resolveWorldChroma(selectedNode.name, selectedNode.domain).primary,
                  color: resolveWorldChroma(selectedNode.name, selectedNode.domain).primary,
                }}
              >
                {selectedNode.type === "project" ? (
                  <Boxes className="size-5" />
                ) : (
                  <Layers className="size-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#00F5D4]">
                  {resolveWorldChroma(selectedNode.name, selectedNode.domain).tag || "WORLD_ENTITY"}
                </span>
                <h2 className="text-base font-display font-medium text-white tracking-wide">
                  {selectedNode.name}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1.5 text-gray-40 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Live Telemetry Provenance Badge */}
            <FeexWorldBadge
              sha={selectedNode.id ? `sha-${selectedNode.id.substring(0, 7)}` : "sha-canonical"}
              status="VERIFIED 100%"
            />

            {selectedNode.description && (
              <div>
                <h4 className="text-[10px] uppercase tracking-wider text-gray-40 mb-2">
                  Observed Description
                </h4>
                <p className="text-xs text-gray-30 leading-relaxed bg-[#040406] p-4 border border-gray-20">
                  {selectedNode.description}
                </p>
              </div>
            )}

            {selectedNode.type === "project" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-gray-20 bg-[#040406] p-3">
                    <span className="text-[10px] uppercase text-gray-40 block">Domain</span>
                    <span className="text-xs font-semibold text-[#00F5D4] mt-1 block">
                      {selectedNode.domain || "Engineering"}
                    </span>
                  </div>
                  <div className="border border-gray-20 bg-[#040406] p-3">
                    <span className="text-[10px] uppercase text-gray-40 block">Primary Language</span>
                    <span className="text-xs font-semibold text-white mt-1 block">
                      {selectedNode.language || "TypeScript"}
                    </span>
                  </div>
                </div>

                {selectedNode.repository && (
                  <div className="border border-gray-20 bg-[#040406] p-4">
                    <div className="flex items-center justify-between text-[10px] text-gray-40 mb-1">
                      <span>Repository Provenance</span>
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                    </div>
                    <div className="font-mono text-xs text-emerald-400 font-semibold break-all">
                      {selectedNode.repository}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              {selectedNode.type === "project" && (
                <Link
                  to={`/evidence/${encodeURIComponent(selectedNode.id || selectedNode.name)}`}
                  className="w-full h-10 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <FileCode className="size-4" />
                  <span>Inspect Evidence Provenance</span>
                </Link>
              )}
              {selectedNode.url && (
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-10 bg-white hover:bg-gray-90 text-black font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Inspect GitHub Source</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              <Link
                to={`/navigator?q=${encodeURIComponent(selectedNode.name)}`}
                className="w-full h-10 border border-gray-20 bg-[#040406] hover:bg-neutral-900 text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="size-4 text-[#00F5D4]" />
                <span>Query in AI Navigator</span>
              </Link>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
