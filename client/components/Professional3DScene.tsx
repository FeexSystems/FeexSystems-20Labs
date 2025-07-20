import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Professional3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create a subtle geometric pattern
    const geometry = new THREE.SphereGeometry(8, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // DeepMind blue
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, -20);
    scene.add(sphere);

    // Add floating particles for subtle animation
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.1,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    scene.add(particlesMesh);

    camera.position.z = 30;

    // Subtle animation
    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);

      // Very slow rotation
      sphere.rotation.y += 0.001;
      sphere.rotation.x += 0.0005;

      // Subtle particle movement
      particlesMesh.rotation.y += 0.0002;

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
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
