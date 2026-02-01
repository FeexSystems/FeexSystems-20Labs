/**
 * Immersive WebGL Particle Field
 * High-performance particle system with mouse interaction and custom shaders
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for particles
const particleVertexShader = `
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uMouse;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Apply wave motion
    float waveX = sin(modelPosition.x * 0.3 + uTime * 0.5) * 0.5;
    float waveY = cos(modelPosition.y * 0.3 + uTime * 0.3) * 0.5;
    float waveZ = sin(modelPosition.z * 0.3 + uTime * 0.4) * 0.5;
    
    modelPosition.x += waveX + aRandomness.x;
    modelPosition.y += waveY + aRandomness.y;
    modelPosition.z += waveZ + aRandomness.z;
    
    // Mouse interaction - particles move away from mouse
    float distToMouse = distance(modelPosition.xy, uMouse * 10.0);
    float mouseInfluence = smoothstep(5.0, 0.0, distToMouse);
    modelPosition.xy += normalize(modelPosition.xy - uMouse * 10.0) * mouseInfluence * 2.0;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);
    
    // Color based on position and time
    vColor = vec3(
      0.2 + sin(uTime * 0.2 + position.x * 0.1) * 0.3,
      0.8 + sin(uTime * 0.3 + position.y * 0.1) * 0.2,
      0.5 + sin(uTime * 0.4 + position.z * 0.1) * 0.3
    );
    
    vAlpha = smoothstep(0.0, 5.0, -viewPosition.z) * (1.0 - mouseInfluence * 0.5);
  }
`;

// Fragment shader for particles
const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Circular particle with soft edges
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    
    // Glow effect
    float glow = exp(-distanceToCenter * 3.0) * 0.5;
    
    vec3 finalColor = vColor + glow * vec3(0.3, 0.8, 0.5);
    float finalAlpha = (strength + glow) * vAlpha * 0.8;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

function ParticleSystem({ count = 5000, size = 50 }) {
    const pointsRef = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Generate particle positions and attributes
    const { positions, scales, randomness } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const randomness = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical distribution with more density in center
            const radius = Math.random() * 20 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) - 10;

            scales[i] = Math.random() * 1.5 + 0.5;

            randomness[i3] = (Math.random() - 0.5) * 2;
            randomness[i3 + 1] = (Math.random() - 0.5) * 2;
            randomness[i3 + 2] = (Math.random() - 0.5) * 2;
        }

        return { positions, scales, randomness };
    }, [count]);

    // Create shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: size },
                uMouse: { value: new THREE.Vector2(0, 0) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, [size]);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animation
    useFrame((state) => {
        if (pointsRef.current) {
            shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
            shaderMaterial.uniforms.uMouse.value.set(
                mouseRef.current.x * viewport.width * 0.5,
                mouseRef.current.y * viewport.height * 0.5
            );

            // Gentle rotation
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <points ref={pointsRef} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aScale"
                    count={count}
                    array={scales}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-aRandomness"
                    count={count}
                    array={randomness}
                    itemSize={3}
                />
            </bufferGeometry>
        </points>
    );
}

interface ParticleFieldProps {
    className?: string;
    particleCount?: number;
}

export function ParticleField({ className = '', particleCount = 5000 }: ParticleFieldProps) {
    return (
        <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <ParticleSystem count={particleCount} />
            </Canvas>
        </div>
    );
}
