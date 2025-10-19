// src/components/Planets.jsx
import React from "react";
import { Sphere } from "@react-three/drei";

export default function Planets() {
  return (
    <>
      {/* Moon */}
      <Sphere args={[0.3, 32, 32]} position={[3, 1, -2]}>
        <meshStandardMaterial color="#dddddd" />
      </Sphere>

      {/* Planet */}
      <Sphere args={[0.5, 32, 32]} position={[-4, -1.5, -5]}>
        <meshStandardMaterial color="#2255aa" />
      </Sphere>

      {/* Distant Planet */}
      <Sphere args={[1.2, 32, 32]} position={[6, 2, -10]}>
        <meshStandardMaterial color="#aa4422" />
      </Sphere>
    </>
  );
}
