import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Function to create a new meteor
function createMeteor() {
  const x = -50; // Start from far left
  const y = Math.random() * 30 + 10; // Random Y height
  const z = -30 - Math.random() * 20; // Slight depth randomness

  const start = new THREE.Vector3(x, y, z);
  const direction = new THREE.Vector3(1, -0.2, 0).normalize(); // Move to the right and slightly down
  const speed = 10 + Math.random() * 5; // Slower for cinematic look

  return {
    start,
    direction,
    speed,
    createdAt: performance.now() / 1000,
  };
}

export function ShootingStars({ frequency = 0.002 }) {
  const [meteors, setMeteors] = useState([]);
  const meteorLife = 5; // seconds
  const trailLength = 25; // much longer trails

  useFrame((state, delta) => {
    // Possibly spawn a new meteor
    if (Math.random() < frequency) {
      setMeteors((prev) => [...prev, createMeteor()]);
    }

    // Remove old meteors
    const now = performance.now() / 1000;
    setMeteors((prev) => prev.filter((m) => now - m.createdAt < meteorLife));
  });

  return (
    <>
      {meteors.map((meteor, index) => {
        const now = performance.now() / 1000;
        const age = now - meteor.createdAt;

        const move = meteor.direction
          .clone()
          .multiplyScalar(age * meteor.speed);
        const currentPos = meteor.start.clone().add(move);
        const tailPos = currentPos
          .clone()
          .sub(meteor.direction.clone().multiplyScalar(trailLength));

        const opacity = 1 - age / meteorLife;

        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={
                  new Float32Array([
                    tailPos.x,
                    tailPos.y,
                    tailPos.z,
                    currentPos.x,
                    currentPos.y,
                    currentPos.z,
                  ])
                }
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color={new THREE.Color("white")}
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              linewidth={2} // Doesn't work in most browsers unless using special materials
            />
          </line>
        );
      })}
    </>
  );
}
