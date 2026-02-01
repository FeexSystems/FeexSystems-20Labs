/**
 * Immersive Hero Background
 * Combined WebGL effects for the hero section
 * Features: particles, neural network connections, gradient lighting
 */

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized vertex shader for combined particles
const combinedVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Organic floating motion
    float floatY = sin(uTime * 0.3 + aPhase) * 0.5;
    float floatX = cos(uTime * 0.2 + aPhase * 1.3) * 0.3;
    float floatZ = sin(uTime * 0.4 + aPhase * 0.7) * 0.4;
    
    modelPosition.x += floatX;
    modelPosition.y += floatY;
    modelPosition.z += floatZ;
    
    // Mouse repulsion
    vec2 toMouse = modelPosition.xy - uMouse;
    float distToMouse = length(toMouse);
    float mouseInfluence = smoothstep(8.0, 0.0, distToMouse) * uMouseStrength;
    modelPosition.xy += normalize(toMouse + 0.001) * mouseInfluence * 3.0;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    // Size with perspective
    float sizeScale = 1.0 + sin(uTime * 2.0 + aPhase) * 0.2;
    gl_PointSize = uSize * aScale * sizeScale * (1.0 / -viewPosition.z);
    gl_PointSize = max(gl_PointSize, 1.5);
    
    // Pass color with time-based variation
    vColor = aColor + 0.1 * sin(uTime + aPhase);
    
    // Alpha based on depth and mouse
    vAlpha = smoothstep(-50.0, -5.0, viewPosition.z) * (1.0 - mouseInfluence * 0.3);
  }
`;

const combinedFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Distance from center
    float dist = distance(gl_PointCoord, vec2(0.5));
    
    // Soft circle
    float strength = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Glow
    float glow = exp(-dist * 4.0) * 0.6;
    
    vec3 finalColor = vColor;
    float finalAlpha = (strength + glow) * vAlpha;
    
    if (finalAlpha < 0.01) discard;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

// Connection lines shader
const connectionVertexShader = `
  uniform float uTime;
  
  attribute float aOpacity;
  
  varying float vOpacity;
  varying float vProgress;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    
    gl_Position = projectionMatrix * viewPosition;
    
    vOpacity = aOpacity * smoothstep(-50.0, -10.0, viewPosition.z);
    vProgress = position.x * 0.1 + uTime;
  }
`;

const connectionFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  
  varying float vOpacity;
  varying float vProgress;
  
  void main() {
    // Animated pulse
    float pulse = sin(vProgress * 5.0) * 0.5 + 0.5;
    
    gl_FragColor = vec4(uColor, vOpacity * pulse * 0.4);
  }
`;

function CombinedParticleSystem({
    particleCount = 3000,
    connectionCount = 200
}) {
    const particlesRef = useRef<THREE.Points>(null);
    const connectionsRef = useRef<THREE.LineSegments>(null);
    const mouseRef = useRef({ x: 0, y: 0, strength: 0 });
    const { viewport } = useThree();

    // Generate particles in a beautiful distribution
    const particleData = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);
        const phases = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);

        // Color palette - mint/teal theme
        const colorPalette = [
            new THREE.Color(0x2dd4bf), // Teal
            new THREE.Color(0x34d399), // Emerald
            new THREE.Color(0x22c55e), // Green
            new THREE.Color(0x10b981), // Mint
            new THREE.Color(0x06b6d4), // Cyan
        ];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Create layers of particles
            const layer = Math.floor(Math.random() * 4);
            const layerZ = layer * 8 - 15;

            // Spiral galaxy-like distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.pow(Math.random(), 0.5) * 25;
            const spiralOffset = angle + radius * 0.1;

            positions[i3] = Math.cos(spiralOffset) * radius + (Math.random() - 0.5) * 5;
            positions[i3 + 1] = Math.sin(spiralOffset) * radius * 0.6 + (Math.random() - 0.5) * 5;
            positions[i3 + 2] = layerZ + (Math.random() - 0.5) * 5;

            scales[i] = Math.random() * 1.5 + 0.3;
            phases[i] = Math.random() * Math.PI * 2;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        return { positions, scales, phases, colors };
    }, [particleCount]);

    // Generate connections between nearby particles
    const connectionData = useMemo(() => {
        const connections: number[] = [];
        const opacities: number[] = [];

        // Find close particles and connect them
        for (let i = 0; i < Math.min(connectionCount * 2, particleCount); i++) {
            for (let j = i + 1; j < Math.min(i + 20, particleCount); j++) {
                if (connections.length / 6 >= connectionCount) break;

                const i3 = i * 3;
                const j3 = j * 3;

                const dx = particleData.positions[i3] - particleData.positions[j3];
                const dy = particleData.positions[i3 + 1] - particleData.positions[j3 + 1];
                const dz = particleData.positions[i3 + 2] - particleData.positions[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 8 && Math.random() < 0.3) {
                    connections.push(
                        particleData.positions[i3], particleData.positions[i3 + 1], particleData.positions[i3 + 2],
                        particleData.positions[j3], particleData.positions[j3 + 1], particleData.positions[j3 + 2]
                    );
                    const opacity = 1 - dist / 8;
                    opacities.push(opacity, opacity);
                }
            }
            if (connections.length / 6 >= connectionCount) break;
        }

        return {
            positions: new Float32Array(connections),
            opacities: new Float32Array(opacities)
        };
    }, [particleData, connectionCount]);

    // Create materials
    const particleMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: combinedVertexShader,
            fragmentShader: combinedFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: 40 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uMouseStrength: { value: 0 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    const connectionMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: connectionVertexShader,
            fragmentShader: connectionFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x2dd4bf) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.strength = 1;
        };

        const handleMouseLeave = () => {
            mouseRef.current.strength = 0;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Animation loop
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Update uniforms
        particleMaterial.uniforms.uTime.value = time;
        connectionMaterial.uniforms.uTime.value = time;

        // Smooth mouse tracking
        const targetX = mouseRef.current.x * viewport.width * 0.4;
        const targetY = mouseRef.current.y * viewport.height * 0.4;
        particleMaterial.uniforms.uMouse.value.x += (targetX - particleMaterial.uniforms.uMouse.value.x) * 0.05;
        particleMaterial.uniforms.uMouse.value.y += (targetY - particleMaterial.uniforms.uMouse.value.y) * 0.05;
        particleMaterial.uniforms.uMouseStrength.value += (mouseRef.current.strength - particleMaterial.uniforms.uMouseStrength.value) * 0.1;

        // Gentle rotation
        if (particlesRef.current) {
            particlesRef.current.rotation.y = time * 0.02;
            particlesRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
        }
        if (connectionsRef.current) {
            connectionsRef.current.rotation.y = time * 0.02;
            connectionsRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <group>
            {/* Connections */}
            {connectionData.positions.length > 0 && (
                <lineSegments ref={connectionsRef} material={connectionMaterial}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={connectionData.positions.length / 3}
                            array={connectionData.positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-aOpacity"
                            count={connectionData.opacities.length}
                            array={connectionData.opacities}
                            itemSize={1}
                        />
                    </bufferGeometry>
                </lineSegments>
            )}

            {/* Particles */}
            <points ref={particlesRef} material={particleMaterial}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={particleData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aScale"
                        count={particleCount}
                        array={particleData.scales}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aPhase"
                        count={particleCount}
                        array={particleData.phases}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aColor"
                        count={particleCount}
                        array={particleData.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
            </points>
        </group>
    );
}

// Ambient gradient orbs
function AmbientOrbs() {
    const orbsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (orbsRef.current) {
            orbsRef.current.children.forEach((child, i) => {
                const mesh = child as THREE.Mesh;
                mesh.position.y = Math.sin(state.clock.elapsedTime * 0.2 + i) * 2;
                mesh.position.x = Math.cos(state.clock.elapsedTime * 0.15 + i * 1.5) * 2;
            });
        }
    });

    return (
        <group ref={orbsRef}>
            {[...Array(3)].map((_, i) => (
                <mesh key={i} position={[(i - 1) * 15, 0, -20]}>
                    <sphereGeometry args={[5 + i * 2, 32, 32]} />
                    <meshBasicMaterial
                        color={[0x2dd4bf, 0x34d399, 0x22c55e][i]}
                        transparent
                        opacity={0.03}
                    />
                </mesh>
            ))}
        </group>
    );
}

interface ImmersiveHeroBackgroundProps {
    className?: string;
    particleCount?: number;
    quality?: 'low' | 'medium' | 'high';
}

export function ImmersiveHeroBackground({
    className = '',
    particleCount = 2500,
    quality = 'high'
}: ImmersiveHeroBackgroundProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Reduce particles based on quality
    const adjustedCount = quality === 'low' ? particleCount * 0.3 :
        quality === 'medium' ? particleCount * 0.6 :
            particleCount;

    // Performance monitoring
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );

        const container = document.getElementById('hero-webgl-container');
        if (container) observer.observe(container);

        return () => observer.disconnect();
    }, []);

    if (!isVisible) return null;

    return (
        <div
            id="hero-webgl-container"
            className={`absolute inset-0 overflow-hidden ${className}`}
            style={{ zIndex: 0 }}
        >
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                dpr={quality === 'low' ? 1 : [1, 2]}
                gl={{
                    antialias: quality !== 'low',
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true
                }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <CombinedParticleSystem
                        particleCount={adjustedCount}
                        connectionCount={Math.floor(adjustedCount * 0.1)}
                    />
                    <AmbientOrbs />
                </Suspense>
            </Canvas>

            {/* Gradient overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 22, 40, 0.4) 70%, rgba(10, 22, 40, 0.8) 100%)',
                }}
            />
        </div>
    );
}

// Alternate export name for flexibility
export const ImmersiveBackground = ImmersiveHeroBackground;
