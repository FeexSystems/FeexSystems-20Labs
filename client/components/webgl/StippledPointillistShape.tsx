import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Vertex shader for the floating stippled shape
const stippleVertexShader = `
  uniform float uTime;
  uniform float uMorph;
  uniform vec2 uMouse;

  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aInitialPos;

  varying float vAlpha;
  varying float vDist;

  void main() {
    vec3 pos = aInitialPos;

    // Harmonic multi-frequency morphing deformation
    float theta = atan(pos.z, pos.x);
    float phi = acos(clamp(pos.y / (length(pos) + 0.0001), -1.0, 1.0));

    float wave1 = sin(theta * 3.0 + uTime * 0.8) * cos(phi * 4.0 - uTime * 0.6) * 0.45;
    float wave2 = sin(pos.y * 2.5 + uTime * 1.2) * 0.3;
    float wave3 = cos(length(pos) * 4.0 - uTime * 0.9) * 0.25;

    pos += normalize(pos) * (wave1 + wave2 + wave3) * uMorph;

    // Gentle mouse interaction tilt
    pos.x += uMouse.x * 0.6;
    pos.y += uMouse.y * 0.4;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Point size attenuation for realistic pointillist depth
    gl_PointSize = aSize * (45.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 32.0);

    vAlpha = aAlpha * smoothstep(0.0, 2.5, -viewPosition.z);
    vDist = length(pos);
  }
`;

// Fragment shader for pure monochrome stipple dots
const stippleFragmentShader = `
  varying float vAlpha;
  varying float vDist;

  void main() {
    // Sharp stippled dot with soft gaussian edge falloff
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;

    float strength = 1.0 - smoothstep(0.15, 0.5, d);
    float alpha = strength * vAlpha;

    // Pure monochrome white with micro intensity modulation
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// GPU Vertex shader for undulating uncertain landscape terrain
const landscapeVertexShader = `
  uniform float uTime;
  attribute float aAlpha;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float t = uTime * 0.4;
    float wave = sin(pos.x * 0.35 + t * 0.9) * cos(pos.z * 0.35 + t * 0.7) * 0.65 +
                 sin(pos.z * 0.6 - t * 0.5) * 0.35 +
                 cos((pos.x + pos.z) * 0.25 + t * 0.4) * 0.25;
    pos.y = -2.5 + wave;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 3.2 * (25.0 / -viewPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 10.0);

    vAlpha = aAlpha;
  }
`;

// GPU Fragment shader for landscape terrain
const landscapeFragmentShader = `
  varying float vAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float strength = 1.0 - smoothstep(0.1, 0.5, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength * vAlpha * 0.5);
  }
`;

// Floating stippled point cloud shape
function FloatingStippledCore({
  count = 8500,
  morphScale = 1.0,
  radius = 2.4,
}: {
  count?: number;
  morphScale?: number;
  radius?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  const [positions, sizes, alphas, initialPos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const alp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Fibonacci sphere distribution with radius variation for volumetric stippling
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const baseRadius = radius + (Math.random() - 0.5) * 0.8;

      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.cos(phi);
      const z = baseRadius * Math.sin(phi) * Math.sin(theta);

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;

      initPos[i3] = x;
      initPos[i3 + 1] = y;
      initPos[i3 + 2] = z;

      // Varied stipple dot sizes (dense fine stippling)
      sz[i] = Math.random() < 0.15 ? 3.5 : Math.random() < 0.4 ? 2.2 : 1.4;
      alp[i] = 0.4 + Math.random() * 0.6;
    }

    return [pos, sz, alp, initPos];
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: morphScale },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [morphScale]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    uniforms.uTime.value = t;
    uniforms.uMorph.value = morphScale;

    // Smooth lerp for mouse coordinates
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x * 0.8, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y * 0.5, 0.05);
    uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);

    // Continuous slow scientific rotation
    pointsRef.current.rotation.y = t * 0.12;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    pointsRef.current.position.y = 0.4 + Math.sin(t * 0.4) * 0.18;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aInitialPos" count={count} array={initialPos} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aAlpha" count={count} array={alphas} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={stippleVertexShader}
        fragmentShader={stippleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Undulating "uncertain landscape" particle terrain beneath the floating shape (GPU-accelerated)
function UncertainLandscape({ gridWidth = 60, gridDepth = 60 }: { gridWidth?: number; gridDepth?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = gridWidth * gridDepth;

  const [positions, alphas] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const alp = new Float32Array(count);
    let idx = 0;

    const spacing = 0.38;
    const offsetX = (gridWidth * spacing) / 2;
    const offsetZ = (gridDepth * spacing) / 2;

    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridDepth; j++) {
        const x = i * spacing - offsetX;
        const z = j * spacing - offsetZ;
        const y = -2.5;

        pos[idx * 3] = x;
        pos[idx * 3 + 1] = y;
        pos[idx * 3 + 2] = z;

        // Fade out toward edges of the grid
        const distFromCenter = Math.sqrt(x * x + z * z);
        alp[idx] = Math.max(0, 0.65 - distFromCenter * 0.04);

        idx++;
      }
    }

    return [pos, alp];
  }, [gridWidth, gridDepth, count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aAlpha" count={count} array={alphas} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={landscapeVertexShader}
        fragmentShader={landscapeFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Luminous guide path particle (the one ahead clearing the path, the one behind trusting the hold)
function GuidePathBeacons() {
  const beacon1 = useRef<THREE.Mesh>(null!);
  const beacon2 = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Leader particle (ahead)
    const x1 = Math.sin(t * 0.6) * 3.2;
    const z1 = Math.cos(t * 0.6) * 3.2;
    const y1 = -0.5 + Math.sin(t * 1.2) * 0.4;
    if (beacon1.current) beacon1.current.position.set(x1, y1, z1);

    // Follower particle (trusting the hold)
    const t2 = t - 0.4;
    const x2 = Math.sin(t2 * 0.6) * 2.5;
    const z2 = Math.cos(t2 * 0.6) * 2.5;
    const y2 = -0.9 + Math.sin(t2 * 1.2) * 0.35;
    if (beacon2.current) beacon2.current.position.set(x2, y2, z2);
  });

  return (
    <group>
      <mesh ref={beacon1}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={beacon2}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// Parallax camera movement on cursor hover
function ScientificCamera() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 1.5,
      0.03
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.8 + state.pointer.y * 1.0,
      0.03
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export interface StippledPointillistShapeProps {
  className?: string;
  count?: number;
  showLandscape?: boolean;
  showBeacons?: boolean;
  morphScale?: number;
  radius?: number;
  height?: string;
  cameraZ?: number;
}

export function StippledPointillistShape({
  className = "",
  count = 8500,
  showLandscape = true,
  showBeacons = true,
  morphScale = 1.0,
  radius = 2.4,
  height = "h-full w-full",
  cameraZ = 7.5,
}: StippledPointillistShapeProps) {
  return (
    <div
      data-testid="stippled-pointillist-canvas"
      className={`relative overflow-hidden bg-black ${height} ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0.8, cameraZ], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ScientificCamera />
        <FloatingStippledCore count={count} morphScale={morphScale} radius={radius} />
        {showLandscape && <UncertainLandscape gridWidth={60} gridDepth={60} />}
        {showBeacons && <GuidePathBeacons />}
      </Canvas>
    </div>
  );
}

export default StippledPointillistShape;
