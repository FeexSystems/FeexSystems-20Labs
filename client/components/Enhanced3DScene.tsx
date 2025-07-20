import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface SceneData {
  repositories: any[];
  chartData: {
    stars: number[];
    forks: number[];
    categories: { name: string; value: number; color: string }[];
  };
}

interface Enhanced3DSceneProps {
  onDataReady?: (data: SceneData) => void;
}

export function Enhanced3DScene({ onDataReady }: Enhanced3DSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x00aaff, 2, 50);
    pointLight1.position.set(-10, 5, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00aa, 1.5, 30);
    pointLight2.position.set(10, -5, -10);
    scene.add(pointLight2);

    // Main wireframe globe (enhanced)
    const globeGeometry = new THREE.SphereGeometry(3, 64, 64);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globe.position.set(0, 0, -8);
    globe.userData = { id: "main-globe", name: "FeexSystems Core" };
    scene.add(globe);

    // AI Core Model (simulated neural network)
    const aiCoreGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      emissive: 0x003333,
    });

    // Create neural network nodes
    for (let i = 0; i < 20; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
      );
      aiCoreGroup.add(node);

      // Add connections between nodes
      if (i > 0) {
        const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
          node.position.clone(),
          aiCoreGroup.children[i - 1].position.clone(),
        ]);
        const connectionMaterial = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3,
        });
        const connection = new THREE.Line(
          connectionGeometry,
          connectionMaterial,
        );
        aiCoreGroup.add(connection);
      }
    }
    aiCoreGroup.position.set(8, 0, -5);
    aiCoreGroup.userData = { id: "ai-core", name: "AI Neural Network" };
    scene.add(aiCoreGroup);

    // Data Orbs with trailing particles
    const dataOrbs: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        emissive: 0x002200,
        transparent: true,
        opacity: 0.8,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20,
      );
      orb.userData = {
        id: `data-orb-${i}`,
        name: `Data Flow ${i + 1}`,
        initialY: orb.position.y,
      };
      dataOrbs.push(orb);
      scene.add(orb);
    }

    // Holographic Logo (FeexSystems text)
    const loader = new THREE.FontLoader();
    // Note: In a real implementation, you'd load a font file
    // For now, we'll create a simple geometric logo
    const logoGeometry = new THREE.BoxGeometry(2, 0.5, 0.1);
    const logoMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      emissive: 0x331100,
      transparent: true,
      opacity: 0.7,
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(-8, 2, -5);
    logo.userData = { id: "feex-logo", name: "FeexSystems Logo" };
    scene.add(logo);

    // Fetch GitHub data for charts
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/FeexSystems/repos",
          {
            headers: { Accept: "application/vnd.github.v3+json" },
          },
        );
        const repos = await response.json();

        const stars = repos
          .slice(0, 5)
          .map((repo: any) => repo.stargazers_count);
        const forks = repos.slice(0, 5).map((repo: any) => repo.forks_count);
        const categories = [
          { name: "AI", value: 40, color: "#00aaff" },
          { name: "DevOps", value: 30, color: "#ff6600" },
          { name: "Security", value: 30, color: "#00ff00" },
        ];

        const sceneData: SceneData = {
          repositories: repos,
          chartData: { stars, forks, categories },
        };

        onDataReady?.(sceneData);
        createCharts(sceneData.chartData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        // Fallback data
        const fallbackData: SceneData = {
          repositories: [],
          chartData: {
            stars: [10, 25, 30, 15, 20],
            forks: [5, 8, 12, 6, 9],
            categories: [
              { name: "AI", value: 40, color: "#00aaff" },
              { name: "DevOps", value: 30, color: "#ff6600" },
              { name: "Security", value: 30, color: "#00ff00" },
            ],
          },
        };
        onDataReady?.(fallbackData);
        createCharts(fallbackData.chartData);
      }
    };

    // Create 3D charts
    const createCharts = (chartData: SceneData["chartData"]) => {
      // 3D Bar Chart (Repository Stars)
      const barGroup = new THREE.Group();
      chartData.stars.forEach((stars, index) => {
        const height = (stars / 10) * 2 + 0.5; // Scale height
        const barGeometry = new THREE.BoxGeometry(0.5, height, 0.5);
        const barMaterial = new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(index * 0.2, 0.8, 0.6),
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.set(index * 1.2 - 2, height / 2, 5);
        bar.userData = { id: `bar-${index}`, value: stars };
        barGroup.add(bar);
      });
      barGroup.userData = { id: "bar-chart", name: "Repository Stars" };
      scene.add(barGroup);

      // 3D Line Chart (Repository Activity)
      const linePoints: THREE.Vector3[] = [];
      chartData.forks.forEach((forks, index) => {
        linePoints.push(new THREE.Vector3(index * 1.2 - 2, (forks / 5) * 2, 8));
      });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData = { id: "line-chart", name: "Repository Activity" };
      scene.add(line);

      // 3D Pie Chart (Project Categories)
      const pieGroup = new THREE.Group();
      let startAngle = 0;
      chartData.categories.forEach((category, index) => {
        const angle = (category.value / 100) * Math.PI * 2;
        const pieGeometry = new THREE.CylinderGeometry(
          1.5,
          1.5,
          0.2,
          32,
          1,
          false,
          startAngle,
          angle,
        );
        const pieMaterial = new THREE.MeshLambertMaterial({
          color: category.color,
        });
        const pieSlice = new THREE.Mesh(pieGeometry, pieMaterial);
        pieSlice.userData = {
          id: `pie-${index}`,
          category: category.name,
          value: category.value,
        };
        pieGroup.add(pieSlice);
        startAngle += angle;
      });
      pieGroup.position.set(8, 0, 8);
      pieGroup.userData = { id: "pie-chart", name: "Project Categories" };
      scene.add(pieGroup);
    };

    fetchGitHubData();

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData?.id) {
          setSelectedObject(object.userData.id);
          // Announce to screen readers
          const announcement = `Selected: ${object.userData.name || object.userData.id}`;
          announceToScreenReader(announcement);
        }
      }
    };

    const announceToScreenReader = (message: string) => {
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.style.position = "absolute";
      liveRegion.style.left = "-9999px";
      liveRegion.textContent = message;
      document.body.appendChild(liveRegion);
      setTimeout(() => document.body.removeChild(liveRegion), 1000);
    };

    window.addEventListener("click", onMouseClick);

    // Camera position
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Animation loop
    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);

      // Rotate main globe
      globe.rotation.y += 0.005;

      // Animate AI Core
      aiCoreGroup.rotation.x += 0.01;
      aiCoreGroup.rotation.y += 0.02;

      // Animate data orbs (floating motion)
      dataOrbs.forEach((orb, index) => {
        orb.position.y =
          orb.userData.initialY + Math.sin(Date.now() * 0.001 + index) * 2;
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.02;
      });

      // Rotate logo
      logo.rotation.y += 0.01;

      // Pulse point lights
      pointLight1.intensity = 1.5 + Math.sin(Date.now() * 0.002) * 0.5;
      pointLight2.intensity = 1 + Math.cos(Date.now() * 0.003) * 0.3;

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [onDataReady]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ zIndex: 1 }}
        role="application"
        aria-label="Enhanced 3D FeexSystems Scene"
      />
      {selectedObject && (
        <div
          className="absolute top-4 left-4 bg-card border border-primary/30 rounded-lg p-3 z-10"
          style={{ boxShadow: "0 0 10px rgba(0, 170, 255, 0.3)" }}
        >
          <p className="text-sm text-primary font-semibold">
            Selected: {selectedObject}
          </p>
        </div>
      )}
    </div>
  );
}
