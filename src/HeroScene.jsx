import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Float, Stars, OrbitControls, Html } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Vector3 } from "three";
import useSound from "use-sound";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

function CustomShaderMaterial({ hover }) {
  const shaderRef = useRef();
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.elapsedTime;
      shaderRef.current.uniforms.uHover.value = hover ? 1.0 : 0.0;
    }
  });

  return (
    <shaderMaterial
      ref={shaderRef}
      attach="material"
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        uTime: { value: 0 },
        uHover: { value: 0 },
      }}
      transparent
    />
  );
}

function ParticleTrail({ target }) {
  const meshRef = useRef();
  const positions = Array(100)
    .fill()
    .map(() => new Vector3());

  useFrame(() => {
    if (!meshRef.current || !target.current) return;
    positions.pop();
    positions.unshift(target.current.position.clone());

    meshRef.current.geometry.setFromPoints(positions);
  });

  return (
    <line ref={meshRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#8A2BE2" transparent opacity={0.4} />
    </line>
  );
}
