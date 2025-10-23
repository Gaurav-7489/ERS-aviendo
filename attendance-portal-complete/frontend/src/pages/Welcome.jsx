import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Sky } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import * as THREE from "three";

// Floating particles
function FloatingParticles() {
  const ref = useRef();
  const count = 400;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      y -= 0.025 + Math.random() * 0.02;
      if (y < -2) y = 30 + Math.random() * 5;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.15} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

// 3D scene with drone camera
function DroneScene() {
  const cameraRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    cameraRef.current.position.set(0, 25, 35);
    gsap.to(cameraRef.current.position, {
      y: 2,
      z: 8,
      duration: 4,
      ease: "power2.inOut",
      onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
    });

    gsap.fromTo(
      logoRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.5, delay: 3.8, ease: "elastic.out(1, 0.5)" }
    );
  }, []);

  return (
    <>
      <perspectiveCamera ref={cameraRef} fov={50} near={0.1} far={1000} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Sky and particles */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <FloatingParticles />

      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Logo */}
      <Text
        ref={logoRef}
        position={[0, 0, 0]}
        fontSize={4}
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
  const features = ["Easy Attendance", "Track Students", "Teacher Insights", "Analyze Performance"];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas full screen */}
      <Canvas className="absolute inset-0" shadows>
        <DroneScene />
      </Canvas>

      {/* Overlay for headings, features, buttons */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-gray-100 leading-snug"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 1 }}
        >
          Effortless Attendance Management
        </motion.h2>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 1 }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 bg-opacity-20 backdrop-blur px-5 py-3 rounded-lg shadow text-gray-100 font-medium hover:scale-105 transform transition-all duration-300"
            >
              {feature}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.8, duration: 1 }}
        >
          <button
            onClick={() => navigate("/auth")}
            className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/info")}
            className="border border-gray-100 text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition duration-300"
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}
