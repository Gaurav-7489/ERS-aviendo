import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { gsap } from "gsap";

// Floating particle system
function FloatingParticles() {
  const particlesRef = useRef();

  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40; // x
      arr[i * 3 + 1] = Math.random() * 20; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40; // z
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      let y = positions.getY(i);
      y -= 0.02; // fall speed
      if (y < -2) y = 20; // reset particle when it hits the ground
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// Sky background gradient
function SkyBackground() {
  const gradient = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 32;
    const height = 256;
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#87ceeb"); // sky blue
    gradient.addColorStop(1, "#ffffff"); // horizon white

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    return texture;
  }, []);

  return (
    <mesh scale={[100, 100, 1]} position={[0, 20, -50]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial map={gradient} side={THREE.BackSide} />
    </mesh>
  );
}

// Scene with camera fly-down
function DroneScene() {
  const cameraRef = useRef();
  const lightRef = useRef();

  useEffect(() => {
    cameraRef.current.position.set(0, 20, 25);
    cameraRef.current.lookAt(0, 0, 0);

    gsap.to(cameraRef.current.position, {
      y: 2,
      z: 8,
      duration: 4,
      ease: "power2.inOut",
      onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
    });
  }, []);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(Date.now() * 0.001) * 5;
      lightRef.current.position.z = Math.cos(Date.now() * 0.001) * 5;
    }
  });

  return (
    <>
      <perspectiveCamera ref={cameraRef} fov={50} near={0.1} far={1000} />
      <ambientLight intensity={0.6} />
      <directionalLight ref={lightRef} position={[5, 5, 5]} intensity={1} />

      {/* Sky and particles */}
      <SkyBackground />
      <FloatingParticles />

      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Center text */}
      <Text
        position={[0, 0, 0]}
        fontSize={3}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        BLUE
      </Text>
    </>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const features = [
    "Easy Attendance",
    "Track Students",
    "Teacher Insights",
    "Analyze Performance",
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-white">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* 3D scene */}
      <div className="relative z-10 w-full max-w-5xl h-72 mb-12">
        <Canvas shadows>
          <DroneScene />
        </Canvas>
      </div>

      {/* Headings, features, buttons (appear after fly-in) */}
      <motion.h2
        className="relative z-10 text-center text-3xl lg:text-4xl font-bold text-gray-700 leading-snug"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        Effortless Attendance Management
      </motion.h2>

      <motion.div
        className="relative z-10 flex flex-wrap justify-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.8, duration: 1 }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-50 px-5 py-3 rounded-lg shadow text-gray-800 font-medium hover:scale-105 transform transition-all duration-300"
          >
            {feature}
          </div>
        ))}
      </motion.div>

      <motion.p
        className="relative z-10 text-center text-gray-600 text-lg lg:text-xl mt-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        Track, analyze, and optimize classroom workflow with a seamless experience
        for both students and teachers.
      </motion.p>

      <motion.div
        className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.2, duration: 1 }}
      >
        <button
          onClick={() => navigate("/auth")}
          className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/info")}
          className="border border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition duration-300"
        >
          Learn More
        </button>
      </motion.div>
    </div>
  );
}
