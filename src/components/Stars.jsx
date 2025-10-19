import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Stars({ count = 700 }) {
  const pointsRef = useRef();

  // Generate random star positions only once
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * 100; // x
      array[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
      array[i * 3 + 2] = -Math.random() * 50 - 5; // z (behind the model)
    }
    return array;
  }, [count]);

  const opacities = useMemo(() => {
    const array = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      array[i] = Math.random() * 0.5 + 0.5; // 0.5 to 1 range
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Subtle drift backward to simulate movement through space
      pointsRef.current.position.z += delta * 0.5;

      // Twinkle: vary opacity subtly over time
      const material = pointsRef.current.material;
      if (material) {
        const time = state.clock.elapsedTime;
        material.opacity = 0.75 + Math.sin(time * 0.5) * 0.15;
      }

      // Reset position if stars move too far forward
      if (pointsRef.current.position.z > 10) {
        pointsRef.current.position.z = 0;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}
