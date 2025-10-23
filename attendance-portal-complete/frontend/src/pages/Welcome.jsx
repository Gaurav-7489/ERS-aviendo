import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function FloatingText({ children, position = [0, 0, 0], fontSize = 1.5 }) {
  const textRef = useRef();
  useFrame(({ clock, mouse }) => {
    if (textRef.current) {
      textRef.current.rotation.y = mouse.x * 0.5;
      textRef.current.rotation.x = mouse.y * 0.3;
      textRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
    }
  });

  return (
    <Float floatIntensity={0.4} rotationIntensity={0.3}>
      <Text
        ref={textRef}
        fontSize={fontSize}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelSegments={3}
        position={position}
      >
        {children}
      </Text>
    </Float>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const features = ["Easy Attendance", "Track Students", "Teacher Insights", "Analyze Performance"];
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-white transition-colors duration-1000">

      {/* Subtle moving gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* 3D Canvas for everything */}
      <div className="relative z-10 w-full max-w-6xl h-[500px] mb-12">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Main Logo */}
          <FloatingText position={[0, 2, 0]} fontSize={3}>BLUE</FloatingText>

          {/* Heading */}
          <FloatingText position={[0, 0.5, 0]} fontSize={1.8}>Effortless Attendance Management</FloatingText>

          {/* Features */}
          {features.map((feat, idx) => (
            <FloatingText
              key={idx}
              position={[-3 + idx * 2, -1, 0]}
              fontSize={1}
            >
              {feat}
            </FloatingText>
          ))}

          {/* CTA Buttons as 3D texts */}
          <FloatingText position={[-2, -3, 0]} fontSize={1} >
            Get Started
          </FloatingText>
          <FloatingText position={[2, -3, 0]} fontSize={1}>
            Learn More
          </FloatingText>

          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>

      {/* Description below canvas */}
      <motion.p
        className="relative z-10 text-center text-gray-600 text-lg lg:text-xl mt-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        Track, analyze, and optimize classroom workflow with a seamless experience for both students and teachers.
      </motion.p>

      {/* Original 2D CTA Buttons */}
      <motion.div
        className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      >
        <button
          onClick={() => navigate("/auth")}
          className="glowing-btn bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition duration-300"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/info")}
          className="glowing-btn border border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition duration-300"
        >
          Learn More
        </button>
      </motion.div>
    </div>
  );
}
