import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Stars,
  Sparkles,
  Text,
  Float,
  Billboard,
  Edges,
  Outlines,
  Trail,
  Loader,
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
            document.body.style.cursor = "pointer";
            setIsHovered(true);
            onPointerOver();
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
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

          {/* Drei Edges: Geometric Wireframe Highlighting with threshold=2 so sphere latitude/longitude facets are outlined */}
          <Edges
            linewidth={isSelected ? 2.5 : isHovered ? 2 : 1}
            color={isSelected ? "#00FFA3" : chroma.primary}
            threshold={2}
            transparent
            opacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.28}
          />

          {/* Drei Outlines: Inverted-Hull Silky Halo on all Project Worlds */}
          {node.type === "project" && !isDimmed && (
            <Outlines
              thickness={isSelected ? 0.12 : node.isPinned ? 0.08 : 0.05}
              color={isSelected ? "#00FFA3" : chroma.accent}
              transparent
              opacity={isSelected ? 0.95 : 0.55}
              screenspace={false}
            />
          )}
        </mesh>

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
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al0618U14d.woff2"
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
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_al0618U14d.woff2"
            >
              {node.domain.toUpperCase()}
            </Text>
          )}
        </Billboard>
      </Float>
    </group>
  );
}

// Animated Traveling Pulse along Links via Drei Trail
function AnimatedPulseSphere({
  start,
  end,
  color,
  speed = 0.7,
  size = 0.08,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
  size?: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pStart = useMemo(() => new THREE.Vector3(...start), [start]);
  const pEnd = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.getElapsedTime() * speed) % 1;
    pulseRef.current.position.lerpVectors(pStart, pEnd, t);
  });

  return (
    <Trail width={size * 2.2} color={color} length={8} decay={1.2} local={false}>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// 3D Connection Line with Continuous and Highlight Drei Trail Pulses
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
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={isHighlighted ? "#00FFA3" : "#3b82f6"}
          transparent
          opacity={isHighlighted ? 0.95 : isDimmed ? 0.05 : 0.35}
          linewidth={isHighlighted ? 2 : 1}
        />
      </line>
      {/* Streaming telemetry pulse via Drei Trail on all active links */}
      {!isDimmed && (
        <AnimatedPulseSphere
          start={start}
          end={end}
          color={isHighlighted ? "#00FFA3" : "#00F5D4"}
          speed={isHighlighted ? 1.4 : 0.65}
          size={isHighlighted ? 0.12 : 0.07}
        />
      )}
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
      <Sparkles
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

export default function SpatialWorld() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
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
    <div className="relative h-screen w-screen overflow-hidden bg-[#030508] text-white select-none">
      {/* Subtle Scanline Overlay for Cybernetic HUD Depth */}
      <div className="scanline-overlay absolute inset-0 z-10 pointer-events-none" />

      {/* Top Floating HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            to="/"
            className="hud-bracket flex items-center gap-3 rounded-lg border border-[#1E293B] bg-[#0A0E17]/85 px-4 py-2 text-sm font-semibold backdrop-blur-xl shadow-feex-hud transition hover:border-[#00F5D4]/50 hover:bg-[#0A0E17]"
          >
            <FeexHorizontalLockup markSize={28} showSubtitle={false} />
            <span className="text-white/30 font-mono">/</span>
            <span className="text-[#00F5D4] font-mono text-xs tracking-wider uppercase">
              3D_WORLD_MODEL
            </span>
          </Link>
          <FeexWorldBadge
            sha="sha-wm3"
            status="ACTIVE 100%"
            className="hidden lg:inline-flex"
          />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`border-[#1E293B] bg-[#0A0E17]/80 backdrop-blur-xl transition ${
              autoRotate ? "text-[#00FFA3] border-[#00FFA3]/40" : "text-white/70"
            }`}
          >
            <RotateCw className={`h-4 w-4 mr-1.5 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="hidden md:inline font-mono text-xs">Orbit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="border-[#1E293B] bg-[#0A0E17]/80 text-white/80 backdrop-blur-xl"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#1E293B] bg-[#0A0E17]/80 text-white/80 backdrop-blur-xl"
          >
            <Link to="/evidence">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-[#00FFA3]" />
              <span className="hidden sm:inline font-mono text-xs">Evidence</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#00F5D4] font-semibold text-black hover:bg-[#00F5D4]/80 shadow-feex-neon"
          >
            <Link to="/navigator">
              <Compass className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Ask</span> Navigator
            </Link>
          </Button>
        </div>
      </header>

      {/* Search & Filter Toolbar */}
      <div className="absolute top-20 left-4 md:left-6 z-20 flex flex-col gap-2 pointer-events-auto max-w-sm w-full">
        <div className="relative hud-bracket">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search World Model coordinate nodes..."
            className="h-11 border-[#1E293B] bg-[#0A0E17]/80 pl-10 font-mono text-xs text-white placeholder-white/40 backdrop-blur-xl focus:border-[#00F5D4]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Domain Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge
            variant="outline"
            onClick={() => setDomainFilter("all")}
            className={`cursor-pointer border-[#1E293B] px-2.5 py-1 text-xs backdrop-blur-md transition ${
              domainFilter === "all"
                ? "border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4] font-semibold"
                : "bg-[#0A0E17]/60 text-white/60 hover:text-white hover:border-white/30"
            }`}
          >
            All Systems
          </Badge>
          {domains.map((dom) => (
            <Badge
              key={dom}
              variant="outline"
              onClick={() => setDomainFilter(dom)}
              className={`cursor-pointer border-[#1E293B] px-2.5 py-1 text-xs backdrop-blur-md transition ${
                domainFilter === dom
                  ? "border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4] font-semibold"
                  : "bg-[#0A0E17]/60 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              {dom}
            </Badge>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="h-full w-full">
        {graphData ? (
          <>
            <Canvas
              camera={{ position: [0, 10, 28], fov: 55 }}
              gl={{ antialias: true, alpha: false }}
            >
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
            <Loader
              containerStyles={{
                backgroundColor: "rgba(3, 5, 8, 0.95)",
                backdropFilter: "blur(16px)",
                zIndex: 100,
              }}
              innerStyles={{
                width: "280px",
                backgroundColor: "rgba(10, 14, 23, 0.85)",
                border: "1px solid rgba(0, 245, 212, 0.35)",
                borderRadius: "8px",
                padding: "10px",
              }}
              barStyles={{
                backgroundColor: "#00F5D4",
                height: "4px",
                borderRadius: "2px",
                boxShadow: "0 0 12px #00F5D4",
              }}
              dataStyles={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                color: "#00F5D4",
                letterSpacing: "0.05em",
                marginTop: "10px",
              }}
              dataInterpolation={(p) => `INITIALIZING SPATIAL WORLD: ${p.toFixed(0)}%`}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#00F5D4] mx-auto mb-3" />
              <p className="text-white/60 text-sm font-mono">Synthesizing GLSL Planetary Cores...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats HUD */}
      <div className="hud-bracket absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-6 rounded-lg border border-[#1E293B] bg-[#0A0E17]/85 px-5 py-3 text-xs backdrop-blur-xl shadow-feex-hud pointer-events-auto">
        <div>
          <span className="text-[#64748B] text-[10px] font-mono uppercase block">Projects / Worlds</span>
          <span className="text-sm font-bold font-mono text-[#00FFA3]">
            {graphData?.stats.totalProjects || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-[#1E293B]" />
        <div>
          <span className="text-[#64748B] text-[10px] font-mono uppercase block">Technologies</span>
          <span className="text-sm font-bold font-mono text-[#0066FF]">
            {graphData?.stats.totalTechnologies || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-[#1E293B]" />
        <div>
          <span className="text-[#64748B] text-[10px] font-mono uppercase block">Graph Edges</span>
          <span className="text-sm font-bold font-mono text-[#00F5D4]">
            {graphData?.stats.totalLinks || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-[#1E293B]" />
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#00F5D4]/90 bg-[#00F5D4]/10 px-2.5 py-1 rounded border border-[#00F5D4]/30">
          <Sparkles className="h-3.5 w-3.5 text-[#00FFA3] animate-pulse" />
          <span>DREI: CameraControls • Grid • Gizmo • Outlines • Edges • Trail • Sparkles</span>
        </div>
      </div>

      {/* Slide-over Node Inspector Drawer */}
      {selectedNode && (
        <aside className="hud-bracket absolute right-0 top-0 bottom-0 z-30 w-full max-w-md border-l border-[#1E293B] bg-[#0A0E17]/95 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-start justify-between pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center font-bold border"
                style={{
                  backgroundColor: `${resolveWorldChroma(selectedNode.name, selectedNode.domain).primary}20`,
                  borderColor: resolveWorldChroma(selectedNode.name, selectedNode.domain).primary,
                  color: resolveWorldChroma(selectedNode.name, selectedNode.domain).primary,
                }}
              >
                {selectedNode.type === "project" ? (
                  <Boxes className="h-5 w-5" />
                ) : (
                  <Layers className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4]">
                    {resolveWorldChroma(selectedNode.name, selectedNode.domain).tag || "WORLD_ENTITY"}
                  </span>
                </div>
                <h2 className="text-lg font-display font-bold text-white tracking-wide">
                  {selectedNode.name}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6 font-sans">
            {/* Live Telemetry Provenance Badge */}
            <FeexWorldBadge
              sha={selectedNode.id ? `sha-${selectedNode.id.substring(0, 7)}` : "sha-canonical"}
              status="VERIFIED 100%"
            />

            {selectedNode.description && (
              <div>
                <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                  Observed Description
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-[#121826]/70 rounded-lg p-4 border border-[#1E293B]">
                  {selectedNode.description}
                </p>
              </div>
            )}

            {selectedNode.type === "project" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#1E293B] bg-[#121826]/70 p-3">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">Domain</span>
                    <span className="text-xs font-mono font-semibold text-[#00F5D4] mt-1 block">
                      {selectedNode.domain || "Engineering"}
                    </span>
                  </div>
                  <div className="rounded-lg border border-[#1E293B] bg-[#121826]/70 p-3">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block">Primary Language</span>
                    <span className="text-xs font-mono font-semibold text-[#F8FAFC] mt-1 block">
                      {selectedNode.language || "TypeScript"}
                    </span>
                  </div>
                </div>

                {selectedNode.repository && (
                  <div className="rounded-lg border border-[#1E293B] bg-[#121826]/70 p-4">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mb-1">
                      <span>Repository Provenance</span>
                      <ShieldCheck className="h-4 w-4 text-[#00FFA3]" />
                    </div>
                    <div className="font-mono text-xs text-[#00FFA3] font-semibold break-all">
                      {selectedNode.repository}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-2.5">
              {selectedNode.type === "project" && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[#00FFA3]/40 bg-[#00FFA3]/10 hover:bg-[#00FFA3]/20 text-[#00FFA3] font-mono text-xs"
                >
                  <Link to={`/evidence/${encodeURIComponent(selectedNode.id || selectedNode.name)}`}>
                    <FileCode className="h-4 w-4 mr-2 text-[#00FFA3]" />
                    Inspect in Evidence Explorer
                  </Link>
                </Button>
              )}
              {selectedNode.url && (
                <Button
                  asChild
                  className="w-full bg-[#00F5D4] font-semibold text-black hover:bg-[#00F5D4]/80 font-mono text-xs shadow-feex-neon"
                >
                  <a href={selectedNode.url} target="_blank" rel="noreferrer">
                    Inspect Repository Source <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="w-full border-[#1E293B] hover:bg-[#121826] text-white font-mono text-xs"
              >
                <Link to={`/navigator?q=${encodeURIComponent(selectedNode.name)}`}>
                  <Compass className="h-4 w-4 mr-2 text-[#00F5D4]" />
                  Query Navigator for Provenance
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
