import React, { useRef, useState, Suspense } from "react";
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
  const [exploded, setExploded] = useState(false);

  const particleCount = 250; // optimized for production
  const particles = useRef(
    Array.from({ length: particleCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      velocity: new THREE.Vector3()
    }))
  ).current;

  useFrame(({ clock, mouse }) => {
    // Logo rotation, float, scale
    if (textRef.current && !exploded) {
      textRef.current.rotation.y = mouse.x * 0.8 + Math.sin(clock.getElapsedTime()) * 0.2;
      textRef.current.rotation.x = mouse.y * 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      const float = Math.sin(clock.getElapsedTime() * 2) * 0.4;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
      textRef.current.position.y = float;
      textRef.current.scale.set(scale, scale, scale);
    }

    // Orbiting light
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.position.x = Math.sin(t) * 8;
      lightRef.current.position.z = Math.cos(t) * 8;
      lightRef.current.position.y = Math.sin(t * 0.5) * 3;
    }

    // Particle system
    if (particleRef.current) {
      particleRef.current.rotation.y += 0.002;

      const mouseVec = new THREE.Vector3(mouse.x * 10, mouse.y * 10, 0);
      particleRef.current.children.forEach((p, i) => {
        if (!exploded) {
          const dir = new THREE.Vector3().subVectors(p.position, mouseVec);
          const dist = dir.length();
          if (dist < 2) dir.multiplyScalar(0.05 / dist);
          p.position.add(dir);
        } else {
          // Explosion movement
          particles[i].velocity.add(particles[i].position.clone().normalize().multiplyScalar(0.1));
          p.position.add(particles[i].velocity);
        }
      });
    }
  });

  const handleClick = () => {
    setExploded(true);
    particleRef.current.children.forEach((p, i) => {
      particles[i].velocity.set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
    });
  };

  return (
    <>
      <Float floatIntensity={1} rotationIntensity={1}>
        {!exploded && (
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
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            BLUE
          </Text>
        )}
      </Float>

      <pointLight ref={lightRef} color="#ff00ff" intensity={2} distance={15} />

      <group ref={particleRef}>
        {Array.from({ length: particleCount }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <sphereBufferGeometry args={[0.05, 6, 6]} />
            <meshBasicMaterial color={new THREE.Color(`hsl(${Math.random() * 360},100%,50%)`)} />
          </mesh>
        ))}
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
        <Suspense fallback={<div className="text-center text-white mt-20">Loading 3D scene...</div>}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <InteractiveLogo />
            <OrbitControls enablePan={false} enableZoom={false} />
            <Stars radius={50} depth={50} count={4000} factor={4} saturation={0} fade />
            <EffectComposer>
              <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.2} />
            </EffectComposer>
          </Canvas>
        </Suspense>
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
