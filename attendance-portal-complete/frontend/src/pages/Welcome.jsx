import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Float, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function InteractiveLogo() {
  const textRef = useRef();
  const lightRef = useRef();
  const particleRef = useRef();

  useFrame(({ clock, mouse }) => {
    if (textRef.current) {
      // Rotate with mouse
      textRef.current.rotation.y = mouse.x * 0.8 + Math.sin(clock.getElapsedTime()) * 0.2;
      textRef.current.rotation.x = mouse.y * 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;

      // Float up/down and pulse scale
      const float = Math.sin(clock.getElapsedTime() * 2) * 0.4;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
      textRef.current.position.y = float;
      textRef.current.scale.set(scale, scale, scale);
    }

    if (lightRef.current) {
      // Orbiting colored light
      const t = clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(t) * 8;
      lightRef.current.position.z = Math.cos(t) * 8;
      lightRef.current.position.y = Math.sin(t * 0.5) * 3;
    }

    if (particleRef.current) {
      // Rotate particle system slowly
      particleRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* Logo Text */}
      <Float floatIntensity={1} rotationIntensity={1}>
        <Text
          ref={textRef}
          fontSize={3}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.03}
          bevelSegments={8}
          toneMapped={false}
        >
          BLUE
        </Text>
      </Float>

      {/* Orbiting light */}
      <pointLight ref={lightRef} color="#ff00ff" intensity={2} distance={15} />

      {/* Particle sphere */}
      <group ref={particleRef}>
        {Array.from({ length: 500 }).map((_, i) => {
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const r = 10 + Math.random() * 5;
          const x = r * Math.sin(theta) * Math.cos(phi);
          const y = r * Math.sin(theta) * Math.sin(phi);
          const z = r * Math.cos(theta);
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereBufferGeometry args={[0.05, 6, 6]} />
              <meshBasicMaterial color={new THREE.Color(`hsl(${Math.random()*360},100%,50%)`)} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const features = ["Easy Attendance", "Track Students", "Teacher Insights", "Analyze Performance"];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black text-white">

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <InteractiveLogo />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} />
          <Stars radius={50} depth={50} count={8000} factor={4} saturation={0} fade />
          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Heading */}
      <motion.h2
        className="relative z-10 text-center text-3xl lg:text-4xl font-bold leading-snug text-cyan-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Effortless Attendance Management
      </motion.h2>

      {/* Features */}
      <motion.div
        className="relative z-10 flex flex-wrap justify-center gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-cyan-900 bg-opacity-30 px-5 py-3 rounded-lg shadow text-white font-medium hover:scale-110 transform transition-all duration-300"
          >
            {feature}
          </div>
        ))}
      </motion.div>

      {/* Description */}
      <motion.p
        className="relative z-10 text-center text-gray-300 text-lg lg:text-xl mt-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        Track, analyze, and optimize classroom workflow with a seamless experience for both students and teachers.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
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
