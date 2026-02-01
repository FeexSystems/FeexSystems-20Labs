/**
 * Neural Network WebGL Visualization
 * Animated connected nodes representing AI/neural network concepts
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for neural connections
const lineVertexShader = `
  uniform float uTime;
  
  attribute float aProgress;
  
  varying float vProgress;
  varying float vAlpha;
  
  void main() {
    vProgress = aProgress;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Subtle wave motion
    modelPosition.x += sin(uTime * 0.5 + position.y * 0.5) * 0.1;
    modelPosition.y += cos(uTime * 0.3 + position.x * 0.5) * 0.1;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    
    gl_Position = projectionMatrix * viewPosition;
    
    // Fade based on depth
    vAlpha = smoothstep(-30.0, -5.0, viewPosition.z);
  }
`;

const lineFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  
  varying float vProgress;
  varying float vAlpha;
  
  void main() {
    // Animated pulse along the line
    float pulse = sin(vProgress * 10.0 - uTime * 3.0) * 0.5 + 0.5;
    float alpha = pulse * vAlpha * 0.6;
    
    // Color gradient along the line
    vec3 color = mix(uColor, vec3(0.2, 1.0, 0.6), pulse);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Vertex shader for nodes
const nodeVertexShader = `
  uniform float uTime;
  uniform float uSize;
  
  attribute float aPhase;
  
  varying float vPulse;
  varying float vAlpha;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Floating animation
    modelPosition.y += sin(uTime * 0.5 + aPhase) * 0.3;
    modelPosition.x += cos(uTime * 0.4 + aPhase * 1.3) * 0.2;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * (1.0 / -viewPosition.z) * (1.0 + sin(uTime * 2.0 + aPhase) * 0.3);
    gl_PointSize = max(gl_PointSize, 2.0);
    
    vPulse = sin(uTime * 2.0 + aPhase) * 0.5 + 0.5;
    vAlpha = smoothstep(-30.0, -5.0, viewPosition.z);
  }
`;

const nodeFragmentShader = `
  uniform vec3 uColor;
  
  varying float vPulse;
  varying float vAlpha;
  
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    
    // Core
    float core = 1.0 - smoothstep(0.0, 0.2, dist);
    
    // Glow
    float glow = exp(-dist * 4.0) * 0.8;
    
    // Outer ring
    float ring = smoothstep(0.35, 0.4, dist) * (1.0 - smoothstep(0.4, 0.45, dist));
    
    float strength = core + glow + ring * vPulse;
    
    vec3 color = uColor + vec3(0.2, 0.5, 0.3) * vPulse;
    
    gl_FragColor = vec4(color, strength * vAlpha);
  }
`;

interface Node {
    position: THREE.Vector3;
    connections: number[];
}

function NeuralNetworkSystem({ nodeCount = 80, connectionDensity = 0.15 }) {
    const nodesRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const { viewport } = useThree();

    // Generate network structure
    const { nodes, nodePositions, nodePhases, linePositions, lineProgress } = useMemo(() => {
        const nodes: Node[] = [];

        // Create nodes in layers
        const layers = 5;
        const nodesPerLayer = Math.ceil(nodeCount / layers);

        for (let layer = 0; layer < layers; layer++) {
            const layerZ = (layer - layers / 2) * 6;

            for (let i = 0; i < nodesPerLayer && nodes.length < nodeCount; i++) {
                const angle = (i / nodesPerLayer) * Math.PI * 2 + layer * 0.5;
                const radius = 8 + Math.random() * 4;

                nodes.push({
                    position: new THREE.Vector3(
                        Math.cos(angle) * radius + (Math.random() - 0.5) * 3,
                        Math.sin(angle) * radius + (Math.random() - 0.5) * 3,
                        layerZ + (Math.random() - 0.5) * 2
                    ),
                    connections: []
                });
            }
        }

        // Create connections
        const connections: [number, number][] = [];
        nodes.forEach((node, i) => {
            nodes.forEach((otherNode, j) => {
                if (i < j) {
                    const distance = node.position.distanceTo(otherNode.position);
                    if (distance < 10 && Math.random() < connectionDensity) {
                        connections.push([i, j]);
                        node.connections.push(j);
                        otherNode.connections.push(i);
                    }
                }
            });
        });

        // Build geometry data
        const nodePositions = new Float32Array(nodes.length * 3);
        const nodePhases = new Float32Array(nodes.length);

        nodes.forEach((node, i) => {
            nodePositions[i * 3] = node.position.x;
            nodePositions[i * 3 + 1] = node.position.y;
            nodePositions[i * 3 + 2] = node.position.z;
            nodePhases[i] = Math.random() * Math.PI * 2;
        });

        const linePositions = new Float32Array(connections.length * 6);
        const lineProgress = new Float32Array(connections.length * 2);

        connections.forEach(([i, j], idx) => {
            const idx6 = idx * 6;
            const idx2 = idx * 2;

            linePositions[idx6] = nodes[i].position.x;
            linePositions[idx6 + 1] = nodes[i].position.y;
            linePositions[idx6 + 2] = nodes[i].position.z;
            linePositions[idx6 + 3] = nodes[j].position.x;
            linePositions[idx6 + 4] = nodes[j].position.y;
            linePositions[idx6 + 5] = nodes[j].position.z;

            lineProgress[idx2] = 0;
            lineProgress[idx2 + 1] = 1;
        });

        return { nodes, nodePositions, nodePhases, linePositions, lineProgress };
    }, [nodeCount, connectionDensity]);

    // Create materials
    const nodeMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: nodeVertexShader,
            fragmentShader: nodeFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 80 },
                uColor: { value: new THREE.Color(0.2, 0.9, 0.5) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    const lineMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: lineVertexShader,
            fragmentShader: lineFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0.1, 0.6, 0.4) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Animation
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        nodeMaterial.uniforms.uTime.value = time;
        lineMaterial.uniforms.uTime.value = time;

        if (nodesRef.current) {
            nodesRef.current.rotation.y = time * 0.05;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y = time * 0.05;
        }
    });

    return (
        <group position={[0, 0, -15]}>
            {/* Connection lines */}
            <lineSegments ref={linesRef} material={lineMaterial}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aProgress"
                        count={lineProgress.length}
                        array={lineProgress}
                        itemSize={1}
                    />
                </bufferGeometry>
            </lineSegments>

            {/* Nodes */}
            <points ref={nodesRef} material={nodeMaterial}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={nodes.length}
                        array={nodePositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aPhase"
                        count={nodes.length}
                        array={nodePhases}
                        itemSize={1}
                    />
                </bufferGeometry>
            </points>
        </group>
    );
}

interface NeuralNetworkProps {
    className?: string;
    nodeCount?: number;
}

export function NeuralNetwork({ className = '', nodeCount = 80 }: NeuralNetworkProps) {
    return (
        <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <NeuralNetworkSystem nodeCount={nodeCount} />
            </Canvas>
        </div>
    );
}
