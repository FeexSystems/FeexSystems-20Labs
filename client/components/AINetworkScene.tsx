import { useEffect, useRef } from "react";
import * as THREE from "three";

interface AINetworkSceneProps {
  intensity?: number;
  color?: string;
  nodeCount?: number;
}

export function AINetworkScene({ 
  intensity = 1, 
  color = "#3B82F6", 
  nodeCount = 100 
}: AINetworkSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create neural network nodes
    const nodes: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    
    // Node geometry and materials
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const activeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    const inactiveMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x666666,
      transparent: true,
      opacity: 0.6
    });

    // Create nodes in 3D space
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, inactiveMaterial.clone());
      
      // Position nodes in a neural network-like structure
      const layer = Math.floor(i / (nodeCount / 5)); // 5 layers
      const posInLayer = (i % (nodeCount / 5)) / (nodeCount / 5);
      
      node.position.x = (layer - 2) * 3;
      node.position.y = (posInLayer - 0.5) * 8;
      node.position.z = (Math.random() - 0.5) * 4;
      
      node.userData = {
        originalPosition: node.position.clone(),
        activationTime: Math.random() * 1000,
        isActive: false
      };
      
      nodes.push(node);
      scene.add(node);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        
        if (distance < 4 && Math.random() > 0.7) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          
          const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1
          });
          
          const line = new THREE.Line(geometry, material);
          line.userData = { 
            nodeA: i, 
            nodeB: j,
            baseOpacity: 0.1
          };
          
          connections.push(line);
          scene.add(line);
        }
      }
    }

    // Particle system for data flow
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 10;
      
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(color, 0.8, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Animation
    let animationId: number;
    let time = 0;

    function animate() {
      animationId = requestAnimationFrame(animate);
      time += 0.016 * intensity;

      // Animate neural network activation waves
      nodes.forEach((node, index) => {
        const userData = node.userData;
        const activationPhase = (time * 0.5 + userData.activationTime) % 1000;
        
        if (activationPhase < 100) {
          // Activation phase
          userData.isActive = true;
          (node.material as THREE.MeshBasicMaterial).copy(activeMaterial);
          
          // Slight position variation
          node.position.copy(userData.originalPosition);
          node.position.add(new THREE.Vector3(
            Math.sin(time * 2 + index) * 0.05,
            Math.cos(time * 1.5 + index) * 0.05,
            Math.sin(time * 3 + index) * 0.05
          ));
        } else {
          userData.isActive = false;
          (node.material as THREE.MeshBasicMaterial).copy(inactiveMaterial);
          node.position.copy(userData.originalPosition);
        }
      });

      // Animate connections based on node activity
      connections.forEach((connection) => {
        const nodeA = nodes[connection.userData.nodeA];
        const nodeB = nodes[connection.userData.nodeB];
        const material = connection.material as THREE.LineBasicMaterial;
        
        if (nodeA.userData.isActive || nodeB.userData.isActive) {
          material.opacity = Math.min(connection.userData.baseOpacity * 5, 0.8);
        } else {
          material.opacity = connection.userData.baseOpacity;
        }
      });

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
        
        // Boundary conditions
        if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 5) velocities[i + 2] *= -1;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;

      // Camera movement
      camera.position.x = Math.sin(time * 0.1) * 8;
      camera.position.y = Math.cos(time * 0.08) * 4;
      camera.position.z = 15 + Math.sin(time * 0.05) * 3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [intensity, color, nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
      aria-label="AI Neural Network Visualization"
    />
  );
}
