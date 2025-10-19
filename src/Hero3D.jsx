// src/Hero3D.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Spaceman from "./components/Spaceman";
import Planets from "./components/Planets";

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      {/* Background & Lighting */}
      <color attach="background" args={["#000015"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={2} color="#8A2BE2" />

      {/* Stars */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade />

      {/* Effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
        />
      </EffectComposer>

      {/* Floating Spaceman */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
        <Spaceman />
      </Float>

      {/* Planets & Moons */}
      <Planets />

      {/* Controls */}
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
