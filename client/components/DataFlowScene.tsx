import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DataFlowSceneProps {
  speed?: number;
  complexity?: number;
  theme?: 'devops' | 'security' | 'ai';
}

export function DataFlowScene({ 
  speed = 1, 
  complexity = 1,
  theme = 'devops'
}: DataFlowSceneProps) {
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

    // Theme colors
    const themeColors = {
      devops: { primary: 0x00ff88, secondary: 0x0088ff, accent: 0xffaa00 },
      security: { primary: 0xff4444, secondary: 0xff8800, accent: 0xffff00 },
      ai: { primary: 0x3b82f6, secondary: 0x8b5cf6, accent: 0x06b6d4 }
    };

    const colors = themeColors[theme];

    // Create server nodes
    const serverNodes: THREE.Group[] = [];
    const serverPositions = [
      { x: -8, y: 2, z: 0 },   // Source
      { x: -4, y: 4, z: -2 },  // Processing 1
      { x: 0, y: 0, z: 0 },    // Central Hub
      { x: 4, y: -2, z: 2 },   // Processing 2
      { x: 8, y: 1, z: -1 },   // Destination
    ];

    serverPositions.forEach((pos, index) => {
      const serverGroup = new THREE.Group();
      
      // Server core
      const coreGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
      const coreMaterial = new THREE.MeshLambertMaterial({
        color: colors.primary
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      serverGroup.add(core);

      // Server lights (status indicators)
      for (let i = 0; i < 3; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const lightMaterial = new THREE.MeshStandardMaterial({
          color: index === 2 ? colors.accent : colors.secondary,
          emissive: index === 2 ? colors.accent : colors.secondary,
          emissiveIntensity: 0.5
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(-0.3 + i * 0.3, 0.6, 0.3);
        serverGroup.add(light);
      }

      serverGroup.position.set(pos.x, pos.y, pos.z);
      serverGroup.userData = { 
        index,
        originalPosition: new THREE.Vector3(pos.x, pos.y, pos.z),
        activity: 0
      };
      
      serverNodes.push(serverGroup);
      scene.add(serverGroup);
    });

    // Create data flow paths
    const dataFlows: THREE.Group[] = [];
    const flowPaths = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Main pipeline
      [0, 2], [2, 4], // Direct routes
    ];

    flowPaths.forEach(([start, end]) => {
      const startPos = serverNodes[start].position;
      const endPos = serverNodes[end].position;
      
      // Create curved path
      const curve = new THREE.QuadraticBezierCurve3(
        startPos.clone(),
        new THREE.Vector3(
          (startPos.x + endPos.x) / 2,
          (startPos.y + endPos.y) / 2 + Math.random() * 2,
          (startPos.z + endPos.z) / 2 + Math.random() * 2
        ),
        endPos.clone()
      );

      // Create data packets
      for (let i = 0; i < 5 * complexity; i++) {
        const packetGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const packetMaterial = new THREE.MeshBasicMaterial({
          color: colors.primary,
          emissive: colors.primary,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.8
        });
        const packet = new THREE.Mesh(packetGeometry, packetMaterial);
        
        packet.userData = {
          curve,
          progress: Math.random(),
          speed: 0.5 + Math.random() * 0.5,
          path: [start, end]
        };
        
        dataFlows.push(packet);
        scene.add(packet);
      }
    });

    // Create floating code fragments
    const codeFragments: THREE.Group[] = [];
    const fragmentTexts = ['010110', '11001', '101010', '001101', '110011'];
    
    for (let i = 0; i < 20; i++) {
      const fragmentGroup = new THREE.Group();
      
      // Create simple geometric representation of code
      const geometry = new THREE.PlaneGeometry(0.5, 0.1);
      const material = new THREE.MeshBasicMaterial({
        color: colors.secondary,
        transparent: true,
        opacity: 0.6
      });
      const fragment = new THREE.Mesh(geometry, material);
      fragmentGroup.add(fragment);
      
      fragmentGroup.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      fragmentGroup.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        originalOpacity: 0.6
      };
      
      codeFragments.push(fragmentGroup);
      scene.add(fragmentGroup);
    }

    // Add monitoring dashboard visualization
    const dashboardGroup = new THREE.Group();
    
    // Dashboard screen
    const screenGeometry = new THREE.PlaneGeometry(3, 2);
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0x001122,
      transparent: true,
      opacity: 0.8
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 6, -5);
    dashboardGroup.add(screen);

    // Dashboard metrics (simple geometric representations)
    for (let i = 0; i < 9; i++) {
      const metricGeometry = new THREE.BoxGeometry(0.2, Math.random() * 0.8 + 0.2, 0.1);
      const metricMaterial = new THREE.MeshStandardMaterial({
        color: colors.accent,
        emissive: colors.accent,
        emissiveIntensity: 0.3
      });
      const metric = new THREE.Mesh(metricGeometry, metricMaterial);
      metric.position.set(
        -1 + (i % 3) * 1,
        5.5 + Math.floor(i / 3) * 0.5,
        -4.9
      );
      metric.userData = { baseHeight: metric.scale.y };
      dashboardGroup.add(metric);
    }

    scene.add(dashboardGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colors.primary, 0.8, 50);
    pointLight1.position.set(0, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(colors.secondary, 0.6, 30);
    pointLight2.position.set(-10, 0, 0);
    scene.add(pointLight2);

    // Animation
    let animationId: number;
    let time = 0;

    function animate() {
      animationId = requestAnimationFrame(animate);
      time += 0.016 * speed;

      // Animate server activity
      serverNodes.forEach((server, index) => {
        const activity = Math.sin(time * 2 + index) * 0.5 + 0.5;
        server.userData.activity = activity;
        
        // Pulse server cores
        const core = server.children[0] as THREE.Mesh;
        const material = core.material as THREE.MeshLambertMaterial;
        // Note: MeshLambertMaterial doesn't have emissiveIntensity, skip this effect
        
        // Animate status lights
        server.children.slice(1).forEach((light, lightIndex) => {
          const lightMaterial = (light as THREE.Mesh).material as THREE.MeshStandardMaterial;
          lightMaterial.emissiveIntensity = 0.5 + Math.sin(time * 3 + lightIndex) * 0.3;
        });

        // Subtle position variation
        server.position.copy(server.userData.originalPosition);
        server.position.y += Math.sin(time + index) * 0.1;
      });

      // Animate data packets
      dataFlows.forEach((packet) => {
        const userData = packet.userData;
        userData.progress += userData.speed * 0.01;
        
        if (userData.progress >= 1) {
          userData.progress = 0;
          // Trigger activity on destination server
          const [start, end] = userData.path;
          serverNodes[end].userData.activity = 1;
        }
        
        const position = userData.curve.getPoint(userData.progress);
        packet.position.copy(position);
        
        // Fade in/out at endpoints
        const material = packet.material as THREE.MeshBasicMaterial;
        const fadeDistance = 0.1;
        if (userData.progress < fadeDistance) {
          material.opacity = userData.progress / fadeDistance * 0.8;
        } else if (userData.progress > 1 - fadeDistance) {
          material.opacity = (1 - userData.progress) / fadeDistance * 0.8;
        } else {
          material.opacity = 0.8;
        }
      });

      // Animate code fragments
      codeFragments.forEach((fragment) => {
        fragment.position.add(fragment.userData.velocity);
        fragment.rotation.z += 0.01;
        
        // Boundary bouncing
        if (Math.abs(fragment.position.x) > 15) {
          fragment.userData.velocity.x *= -1;
        }
        if (Math.abs(fragment.position.y) > 8) {
          fragment.userData.velocity.y *= -1;
        }
        if (Math.abs(fragment.position.z) > 8) {
          fragment.userData.velocity.z *= -1;
        }
        
        // Pulse opacity
        const material = fragment.children[0].material as THREE.MeshBasicMaterial;
        material.opacity = fragment.userData.originalOpacity + 
          Math.sin(time * 2 + fragment.position.x) * 0.2;
      });

      // Animate dashboard metrics
      dashboardGroup.children.slice(1).forEach((metric, index) => {
        const height = metric.userData.baseHeight + 
          Math.sin(time * 1.5 + index) * 0.3;
        metric.scale.y = height;
        
        const material = (metric as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * 2 + index) * 0.2;
      });

      // Camera movement
      camera.position.x = Math.sin(time * 0.1) * 12;
      camera.position.y = 5 + Math.cos(time * 0.08) * 3;
      camera.position.z = 12 + Math.sin(time * 0.05) * 4;
      camera.lookAt(0, 2, 0);

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
  }, [speed, complexity, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
      aria-label="Data Flow Visualization"
    />
  );
}
