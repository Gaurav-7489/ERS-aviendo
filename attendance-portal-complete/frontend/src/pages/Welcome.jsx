import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

      {/* Static oversized 3D Logo */}
      <div className="relative z-10 w-full max-w-5xl h-64 mb-12">
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          
          <Text
            position={[0, 0, 0]}
            fontSize={3}  // much bigger
            color="#1f2937" // dark gray
            anchorX="center"
            anchorY="middle"
          >
            AVIENDO
          </Text>
        </Canvas>
      </div>

      {/* Main heading */}
      <motion.h2
        className="relative z-10 text-center text-3xl lg:text-4xl font-bold text-gray-700 leading-snug"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Effortless Attendance Management
      </motion.h2>

      {/* Feature badges */}
      <motion.div
        className="relative z-10 flex flex-wrap justify-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
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

      {/* Description */}
      <motion.p
        className="relative z-10 text-center text-gray-600 text-lg lg:text-xl mt-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        Track, analyze, and optimize classroom workflow with a seamless experience for both students and teachers.
      </motion.p>

      {/* CTA Buttons */}
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
