import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Float, Billboard } from "@react-three/drei";
import * as THREE from "three";
import {
  Boxes,
  Compass,
  ExternalLink,
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

// 3D Node Sphere
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
  const color = useMemo(() => getNodeColor(node), [node]);
  const size = node.type === "project" ? (node.isPinned ? 1.6 : 1.2) : 0.8;

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={node.position || [0, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onPointerOver();
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
            onPointerOut();
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 0.9 : isDimmed ? 0.1 : 0.45}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={isDimmed ? 0.2 : 0.95}
          />
        </mesh>

        {/* Glow Ring for Pinned Projects */}
        {node.isPinned && !isDimmed && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Billboard Text Label */}
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <Text
            position={[0, size + 0.9, 0]}
            fontSize={node.type === "project" ? 0.65 : 0.45}
            color={isDimmed ? "#6b7280" : "#ffffff"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            {node.name}
          </Text>
        </Billboard>
      </Float>
    </group>
  );
}

// 3D Connection Line
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
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={isHighlighted ? "#34d399" : "#4b5563"}
        transparent
        opacity={isHighlighted ? 0.8 : isDimmed ? 0.05 : 0.25}
        linewidth={isHighlighted ? 2 : 1}
      />
    </line>
  );
}

// Spatial Scene graph layout
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
  const controlsRef = useRef<any>(null);

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
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0.5} fade speed={1} />

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

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
      />
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
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white select-none">
      {/* Top Floating HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-sm font-semibold backdrop-blur-xl transition hover:border-emerald-500/50 hover:bg-black/80"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 font-black text-xs text-black">
              F
            </div>
            <span>FEEXSYSTEMS</span>
            <span className="text-white/40">/</span>
            <span className="text-emerald-400">3D World Model</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/70 backdrop-blur-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>Interactive Spatial Graph</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`border-white/10 bg-black/60 backdrop-blur-xl transition ${
              autoRotate ? "text-emerald-400 border-emerald-500/30" : "text-white/70"
            }`}
          >
            <RotateCw className={`h-4 w-4 mr-1.5 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Rotate</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="border-white/10 bg-black/60 text-white/80 backdrop-blur-xl"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-emerald-500 font-semibold text-black hover:bg-emerald-400"
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
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects, technologies..."
            className="h-11 border-white/10 bg-black/60 pl-10 text-sm text-white placeholder-white/40 backdrop-blur-xl focus:border-emerald-500"
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
            className={`cursor-pointer border-white/10 px-2.5 py-1 text-xs backdrop-blur-md transition ${
              domainFilter === "all"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold"
                : "bg-black/50 text-white/60 hover:text-white hover:border-white/30"
            }`}
          >
            All Domains
          </Badge>
          {domains.map((dom) => (
            <Badge
              key={dom}
              variant="outline"
              onClick={() => setDomainFilter(dom)}
              className={`cursor-pointer border-white/10 px-2.5 py-1 text-xs backdrop-blur-md transition ${
                domainFilter === dom
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold"
                  : "bg-black/50 text-white/60 hover:text-white hover:border-white/30"
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
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-3" />
              <p className="text-white/60 text-sm">Constructing 3D World Model...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats HUD */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-6 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 text-xs backdrop-blur-xl pointer-events-auto">
        <div>
          <span className="text-white/40 block">Projects</span>
          <span className="text-sm font-bold text-emerald-400">
            {graphData?.stats.totalProjects || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="text-white/40 block">Technologies</span>
          <span className="text-sm font-bold text-indigo-400">
            {graphData?.stats.totalTechnologies || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="text-white/40 block">Relationships</span>
          <span className="text-sm font-bold text-cyan-400">
            {graphData?.stats.totalLinks || 0}
          </span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-white/50">
          Click any node to inspect evidence & artifacts
        </div>
      </div>

      {/* Slide-over Node Inspector Drawer */}
      {selectedNode && (
        <aside className="absolute right-0 top-0 bottom-0 z-30 w-full max-w-md border-l border-white/10 bg-black/85 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: `${getNodeColor(selectedNode)}20`, color: getNodeColor(selectedNode) }}
              >
                {selectedNode.type === "project" ? <Boxes className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">
                  {selectedNode.type} entity
                </div>
                <h2 className="text-lg font-bold text-white">{selectedNode.name}</h2>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {selectedNode.description && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                  Observed Description
                </h4>
                <p className="text-sm text-white/80 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5">
                  {selectedNode.description}
                </p>
              </div>
            )}

            {selectedNode.type === "project" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-xs text-white/40 block">Domain</span>
                    <span className="text-sm font-semibold text-white mt-1 block">
                      {selectedNode.domain || "Engineering"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-xs text-white/40 block">Primary Language</span>
                    <span className="text-sm font-semibold text-white mt-1 block">
                      {selectedNode.language || "TypeScript"}
                    </span>
                  </div>
                </div>

                {selectedNode.repository && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                      <span>Repository Provenance</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="font-mono text-xs text-emerald-300 font-semibold break-all">
                      {selectedNode.repository}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-2.5">
              {selectedNode.url && (
                <Button asChild className="w-full bg-emerald-500 font-semibold text-black hover:bg-emerald-400">
                  <a href={selectedNode.url} target="_blank" rel="noreferrer">
                    Inspect Repository Source <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                <Link to={`/navigator?q=${encodeURIComponent(selectedNode.name)}`}>
                  <Compass className="h-4 w-4 mr-2 text-emerald-400" />
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
