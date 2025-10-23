import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import * as THREE from "three";

// Floating stars in space
function FloatingStars() {
  const ref = useRef();
  const count = 300;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 100;
      arr[i * 3 + 1] = Math.random() * 50 + 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i);
      y -= 0.02;
      if (y < 0) y = 50; // reset to top
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.15} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function DroneScene() {
  const cameraRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    cameraRef.current.position.set(0, 40, 60);
    gsap.to(cameraRef.current.position, {
      y: 10,
      z: 15,
      duration: 4,
      ease: "power2.inOut",
      onUpdate: () => cameraRef.current.lookAt(0, 0, 0),
    });

    // Logo drops from top
    gsap.fromTo(
      logoRef.current.position,
      { y: 50 },
      { y: 2, duration: 4, delay: 0.5, ease: "power2.inOut" }
    );

    // Optional bounce effect at landing
    gsap.fromTo(
      logoRef.current.scale,
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 1, y: 1, z: 1, duration: 1.5, delay: 4.5, ease: "elastic.out(1,0.5)" }
    );
  }, []);

  return (
    <>
      <perspectiveCamera ref={cameraRef} fov={50} near={0.1} far={1000} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 20, 5]} intensity={1} />

      {/* Space stars */}
      <FloatingStars />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f9d58" />
      </mesh>

      {/* Logo */}
      <Text
        ref={logoRef}
        position={[0, 50, 0]} // start high, will animate down
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Canvas className="absolute inset-0" shadows>
        <DroneScene />
      </Canvas>

      {/* UI overlay */}
      <div className="relative z-10 flex flex-col items-center justify-end h-screen pb-20 text-center">
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 1 }}
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
          transition={{ delay: 5.3, duration: 1 }}
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
