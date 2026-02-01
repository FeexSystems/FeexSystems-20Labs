/**
 * Wave Mesh Background
 * Animated gradient mesh with displacement shader
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const waveVertexShader = `
  uniform float uTime;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Multiple layers of noise for organic movement
    float noise1 = snoise(vec3(pos.x * uWaveFrequency, pos.y * uWaveFrequency, uTime * 0.3));
    float noise2 = snoise(vec3(pos.x * uWaveFrequency * 2.0, pos.y * uWaveFrequency * 2.0, uTime * 0.5)) * 0.5;
    float noise3 = snoise(vec3(pos.x * uWaveFrequency * 4.0, pos.y * uWaveFrequency * 4.0, uTime * 0.7)) * 0.25;
    
    float elevation = (noise1 + noise2 + noise3) * uWaveAmplitude;
    
    pos.z += elevation;
    
    vElevation = elevation;
    vNormal = normalize(vec3(
      -dFdx(elevation) * 10.0,
      -dFdy(elevation) * 10.0,
      1.0
    ));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waveFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  
  void main() {
    // Create gradient based on UV and elevation
    float mixStrength = (vElevation + 1.0) * 0.5;
    
    // Three-color gradient
    vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.5, mixStrength + vUv.x * 0.3));
    color = mix(color, uColorC, smoothstep(0.5, 1.0, mixStrength + vUv.y * 0.3));
    
    // Add shimmer effect
    float shimmer = sin(vUv.x * 50.0 + uTime * 2.0) * sin(vUv.y * 50.0 + uTime * 1.5) * 0.05;
    color += shimmer;
    
    // Fresnel-like edge glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    color += fresnel * uColorC * 0.3;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 0.8, distance(vUv, vec2(0.5)));
    
    gl_FragColor = vec4(color, 0.8 * vignette);
  }
`;

function WaveMesh() {
    const meshRef = useRef<THREE.Mesh>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: waveVertexShader,
            fragmentShader: waveFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uWaveAmplitude: { value: 0.8 },
                uWaveFrequency: { value: 0.5 },
                uColorA: { value: new THREE.Color(0x0a1628) }, // Deep blue-black
                uColorB: { value: new THREE.Color(0x1a3a52) }, // Dark teal
                uColorC: { value: new THREE.Color(0x2dd4bf) }, // Mint/emerald
            },
            transparent: true,
            side: THREE.DoubleSide,
            extensions: {
                derivatives: true,
            },
        });
    }, []);

    useFrame((state) => {
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

        if (meshRef.current) {
            meshRef.current.rotation.x = -Math.PI * 0.4;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} material={shaderMaterial} position={[0, -5, -10]}>
            <planeGeometry args={[40, 40, 128, 128]} />
        </mesh>
    );
}

interface WaveBackgroundProps {
    className?: string;
}

export function WaveBackground({ className = '' }: WaveBackgroundProps) {
    return (
        <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 5, 15], fov: 50 }}
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <WaveMesh />
            </Canvas>
        </div>
    );
}
