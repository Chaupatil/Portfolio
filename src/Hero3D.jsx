// Hero3D.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath"; // optional for smoother movement

const DancingLetter = ({ letter, index }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Animate position up/down like dancing
    ref.current.position.y = Math.sin(t * 2 + index) * 0.2;
    // Rotate a bit for fun
    ref.current.rotation.y = Math.sin(t * 1.5 + index) * 0.1;
  });

  return (
    <Text3D
      ref={ref}
      font="/fonts/helvetiker_regular.typeface.json"
      size={0.5}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.03}
      bevelSize={0.02}
      bevelSegments={5}
    >
      {letter}
      <meshStandardMaterial color="#60A5FA" metalness={0.4} roughness={0.2} />
    </Text3D>
  );
};

export default function Hero3D() {
  const name = "Shravan Patil".split("");

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#60A5FA" />

      <Center>
        {name.map((letter, i) => (
          <group key={i} position={[i * 0.6 - name.length * 0.3, 0, 0]}>
            <DancingLetter
              letter={letter === " " ? "\u00A0" : letter}
              index={i}
            />
          </group>
        ))}
      </Center>
    </Canvas>
  );
}
