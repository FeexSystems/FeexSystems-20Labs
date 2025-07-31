import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Planet {
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: number;
  texture?: string;
  rings?: boolean;
  moons?: { radius: number; distance: number; speed: number }[];
}

interface SolarSystemProps {
  autoCamera?: boolean;
  focusPlanet?: string | null;
  scale?: number;
  speed?: number;
}

export function SolarSystemScene({
  autoCamera = true,
  focusPlanet = null,
  scale = 1,
  speed = 1,
}: SolarSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetsRef = useRef<Map<string, THREE.Group>>(new Map());
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const animationRef = useRef<number>(0);

  // Realistic planetary data (scaled for visualization)
  const planetData: Planet[] = [
    {
      name: "Mercury",
      radius: 0.3,
      distance: 8,
      speed: 1.59,
      color: 0x8c7853,
    },
    {
      name: "Venus",
      radius: 0.4,
      distance: 12,
      speed: 1.18,
      color: 0xffc649,
    },
    {
      name: "Earth",
      radius: 0.5,
      distance: 16,
      speed: 1.0,
      color: 0x6b93d6,
      moons: [{ radius: 0.15, distance: 1.5, speed: 2.0 }],
    },
    {
      name: "Mars",
      radius: 0.35,
      distance: 22,
      speed: 0.81,
      color: 0xc1440e,
      moons: [
        { radius: 0.08, distance: 1.2, speed: 1.8 },
        { radius: 0.06, distance: 0.9, speed: 2.5 },
      ],
    },
    {
      name: "Jupiter",
      radius: 1.8,
      distance: 35,
      speed: 0.43,
      color: 0xd8ca9d,
      moons: [
        { radius: 0.2, distance: 3.5, speed: 1.2 },
        { radius: 0.18, distance: 4.2, speed: 1.0 },
        { radius: 0.25, distance: 5.1, speed: 0.8 },
        { radius: 0.22, distance: 6.0, speed: 0.6 },
      ],
    },
    {
      name: "Saturn",
      radius: 1.5,
      distance: 50,
      speed: 0.32,
      color: 0xfad5a5,
      rings: true,
      moons: [
        { radius: 0.15, distance: 4.0, speed: 1.1 },
        { radius: 0.25, distance: 5.5, speed: 0.9 },
      ],
    },
    {
      name: "Uranus",
      radius: 0.9,
      distance: 65,
      speed: 0.23,
      color: 0x4fd0e7,
      rings: true,
    },
    {
      name: "Neptune",
      radius: 0.8,
      distance: 80,
      speed: 0.18,
      color: 0x4b70dd,
    },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
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

    // Create starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3),
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(2 * scale, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(3 * scale, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Sun light
    const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0.1);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);

    // Create planets
    const planetsMap = new Map<string, THREE.Group>();

    planetData.forEach((planetInfo) => {
      const planetGroup = new THREE.Group();

      // Planet geometry with proper scaling
      const planetGeometry = new THREE.SphereGeometry(
        planetInfo.radius * scale,
        32,
        32,
      );

      // Create planet material with atmospheric glow
      const planetMaterial = new THREE.MeshLambertMaterial({
        color: planetInfo.color,
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.x = planetInfo.distance * scale;
      planet.castShadow = true;
      planet.receiveShadow = true;
      planetGroup.add(planet);

      // Add atmospheric glow
      const atmosphereGeometry = new THREE.SphereGeometry(
        planetInfo.radius * scale * 1.05,
        32,
        32,
      );
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: planetInfo.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.position.copy(planet.position);
      planetGroup.add(atmosphere);

      // Add rings for Saturn and Uranus
      if (planetInfo.rings) {
        const ringGeometry = new THREE.RingGeometry(
          planetInfo.radius * scale * 1.3,
          planetInfo.radius * scale * 2.2,
          64,
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.position.copy(planet.position);
        rings.rotation.x = Math.PI / 2 + Math.random() * 0.2;
        planetGroup.add(rings);
      }

      // Add moons
      if (planetInfo.moons) {
        planetInfo.moons.forEach((moonInfo, index) => {
          const moonGroup = new THREE.Group();
          const moonGeometry = new THREE.SphereGeometry(
            moonInfo.radius * scale,
            16,
            16,
          );
          const moonMaterial = new THREE.MeshLambertMaterial({
            color: 0x888888,
          });
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          moon.position.x = moonInfo.distance * scale;
          moon.castShadow = true;
          moon.receiveShadow = true;
          moonGroup.add(moon);

          // Position moon group at planet position
          moonGroup.position.copy(planet.position);
          planetGroup.add(moonGroup);

          // Store moon data for animation
          (moonGroup as any).moonData = moonInfo;
        });
      }

      // Store planet data for animation
      (planetGroup as any).planetData = planetInfo;
      (planetGroup as any).angle = Math.random() * Math.PI * 2;

      planetsMap.set(planetInfo.name, planetGroup);
      scene.add(planetGroup);
    });

    planetsRef.current = planetsMap;

    // Camera controls
    let cameraAngle = 0;
    let cameraRadius = 100;
    let cameraTarget = new THREE.Vector3(0, 0, 0);
    let focusedPlanet: THREE.Group | null = null;

    // Handle focus changes
    if (focusPlanet && planetsMap.has(focusPlanet)) {
      focusedPlanet = planetsMap.get(focusPlanet)!;
      setCurrentFocus(focusPlanet);
    }

    // Animation loop
    let lastTime = 0;
    function animate(time: number) {
      animationRef.current = requestAnimationFrame(animate);
      const deltaTime = (time - lastTime) * 0.001 * speed;
      lastTime = time;

      // Animate sun glow
      sunGlow.rotation.y += deltaTime * 0.1;

      // Animate planets
      planetsMap.forEach((planetGroup) => {
        const planetData = (planetGroup as any).planetData;
        const angle = (planetGroup as any).angle || 0;

        // Update orbital position
        (planetGroup as any).angle = angle + deltaTime * planetData.speed * 0.1;
        const newAngle = (planetGroup as any).angle;

        const x = Math.cos(newAngle) * planetData.distance * scale;
        const z = Math.sin(newAngle) * planetData.distance * scale;
        planetGroup.position.set(x, 0, z);

        // Rotate planet on its axis
        const planet = planetGroup.children.find(
          (child) =>
            child instanceof THREE.Mesh &&
            child.geometry instanceof THREE.SphereGeometry,
        );
        if (planet) {
          planet.rotation.y += deltaTime * 2;
        }

        // Animate moons
        planetGroup.children.forEach((child) => {
          if ((child as any).moonData) {
            const moonGroup = child as THREE.Group;
            const moonData = (moonGroup as any).moonData;

            if (!moonGroup.userData.angle) {
              moonGroup.userData.angle = Math.random() * Math.PI * 2;
            }

            moonGroup.userData.angle += deltaTime * moonData.speed * 0.2;

            const moonX =
              Math.cos(moonGroup.userData.angle) * moonData.distance * scale;
            const moonZ =
              Math.sin(moonGroup.userData.angle) * moonData.distance * scale;

            const moon = moonGroup.children[0];
            if (moon) {
              moon.position.set(moonX, 0, moonZ);
              moon.rotation.y += deltaTime;
            }
          }
        });
      });

      // Camera movement
      if (autoCamera) {
        if (focusedPlanet) {
          // Focus on specific planet
          cameraTarget.copy(focusedPlanet.position);
          cameraRadius = 15;
          cameraAngle += deltaTime * 0.5;
        } else {
          // Overview of solar system
          cameraTarget.set(0, 0, 0);
          cameraRadius = 120;
          cameraAngle += deltaTime * 0.2;
        }

        camera.position.x =
          cameraTarget.x + Math.cos(cameraAngle) * cameraRadius;
        camera.position.z =
          cameraTarget.z + Math.sin(cameraAngle) * cameraRadius;
        camera.position.y = cameraTarget.y + Math.sin(cameraAngle * 0.5) * 20;
        camera.lookAt(cameraTarget);
      }

      renderer.render(scene, camera);
    }

    // Start animation
    animate(0);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Initial camera position
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [autoCamera, focusPlanet, scale, speed]);

  // Handle planet focus changes
  useEffect(() => {
    setCurrentFocus(focusPlanet);
  }, [focusPlanet]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        role="application"
        aria-label="Interactive Solar System"
      />

      {/* Planet Information Overlay */}
      {currentFocus && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10">
          <h3 className="font-semibold text-lg text-foreground mb-2">
            {currentFocus}
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            {planetData.find((p) => p.name === currentFocus) && (
              <>
                <p>
                  Distance:{" "}
                  {planetData.find((p) => p.name === currentFocus)?.distance} AU
                </p>
                <p>
                  Orbital Speed:{" "}
                  {planetData
                    .find((p) => p.name === currentFocus)
                    ?.speed.toFixed(2)}
                  x
                </p>
                {planetData.find((p) => p.name === currentFocus)?.moons && (
                  <p>
                    Moons:{" "}
                    {
                      planetData.find((p) => p.name === currentFocus)?.moons
                        ?.length
                    }
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10">
        <h4 className="font-medium text-sm text-foreground mb-2">
          Solar System Explorer
        </h4>
        <div className="flex flex-wrap gap-2">
          {planetData.slice(0, 4).map((planet) => (
            <button
              key={planet.name}
              onClick={() =>
                setCurrentFocus(
                  currentFocus === planet.name ? null : planet.name,
                )
              }
              className={`px-2 py-1 text-xs rounded ${
                currentFocus === planet.name
                  ? "bg-deepmind-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {planet.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
