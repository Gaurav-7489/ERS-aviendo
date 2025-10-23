import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Html, OrbitControls, Stars } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

function PulsingLogo() {
  const ref = useRef();
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      ref.current.scale.set(scale, scale, scale);
      ref.current.position.x = mouse.x * 2;
      ref.current.position.y = mouse.y * 2;
    }
  });

  return (
    <Text
      ref={ref}
      fontSize={3}
      color="#1f2937"
      anchorX="center"
      anchorY="middle"
      bevelEnabled
      bevelThickness={0.05}
      bevelSize={0.03}
    >
      BLUE
    </Text>
  );
}

function FloatingButton({ children, position, onClick }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2;
    }
  });

  return (
    <Text
      ref={ref}
      fontSize={0.7}
      color="#1f2937"
      anchorX="center"
      anchorY="middle"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {children}
    </Text>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const features = ["Easy Attendance", "Track Students", "Teacher Insights", "Analyze Performance"];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={7} fade />

        {/* Ambient & directional light */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Central Logo */}
        <PulsingLogo />

        {/* Floating feature badges */}
        {features.map((feat, idx) => (
          <FloatingButton
            key={idx}
            position={[-4 + idx * 2.5, -2, 0]}
          >
            {feat}
          </FloatingButton>
        ))}

        {/* CTA Buttons */}
        <FloatingButton position={[-2, -4, 0]} onClick={() => navigate("/auth")}>
          Get Started
        </FloatingButton>
        <FloatingButton position={[2, -4, 0]} onClick={() => navigate("/info")}>
          Learn More
        </FloatingButton>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
