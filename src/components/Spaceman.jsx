// src/components/Spaceman.jsx
import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Spaceman(props) {
  const { scene } = useGLTF("/assets/models/astronaut.glb"); // ✅ update path if different
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.x = hovered
        ? Math.sin(state.clock.elapsedTime * 2) * 0.05
        : 0;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.5}
      position={[0, -1, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    />
  );
}
