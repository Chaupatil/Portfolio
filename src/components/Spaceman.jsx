import React, { useRef, useState, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styled, { keyframes } from "styled-components";
import { Howl } from "howler";
import { Stars } from "./Stars";
import { ShootingStars } from "./ShootingStars";

// Animations for Container and Button
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 10px #6e49f7, inset 0 0 6px #2e1e7b;
  }
  50% {
    box-shadow: 0 0 20px #9e7bff, inset 0 0 12px #5a3ea0;
  }
`;

const bounce = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

// Styled components with improvements for mobile
const Container = styled.div`
  pointer-events: auto;
  user-select: none;
  width: 100%;
  max-width: 250px;
  padding: 12px 18px;
  background: linear-gradient(
    145deg,
    rgba(10, 10, 30, 0.95),
    rgba(0, 0, 25, 0.8)
  );
  border: 2px solid #6e49f7;
  border-radius: 4px;
  box-shadow: 0 0 10px #6e49f7, inset 0 0 6px #2e1e7b;
  font-family: "Press Start 2P", monospace, cursive;
  font-weight: 700;
  font-size: 0.75rem;
  color: #d4d4ff;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-shadow: 0 0 4px #7b6eff;
  animation: ${glowPulse} 3s ease-in-out infinite;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 600px) {
    max-width: 180px;
    font-size: 0.65rem;
  }

  @media (max-width: 400px) {
    max-width: 140px;
    font-size: 0.6rem;
  }
`;

const Button = styled.button`
  cursor: pointer;
  background: #7b57ff;
  border: 2px solid #4a31b0;
  border-radius: 3px;
  padding: 6px 14px;
  color: #fff;
  font-weight: 700;
  font-family: "Press Start 2P", monospace, cursive;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 10px;
  box-shadow: 0 0 8px #8e74ff;
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;

  &:hover:enabled {
    background: #9e7bff;
    box-shadow: 0 0 15px #bbaaff;
    transform: rotate(-3deg);
  }

  &:active:enabled {
    background: #6a44db;
    box-shadow: 0 0 6px #6a44db inset;
    transform: rotate(3deg);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Sounds
const whooshSound = new Howl({
  src: ["/assets/sounds/whoosh.mp3"],
  volume: 0.5,
});

const popSound = new Howl({
  src: ["/assets/sounds/pop.mp3"],
  volume: 0.5,
});

// Custom hook for media query detection
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query, matches]);

  return matches;
}

export default function Spaceman(props) {
  const { scene } = useGLTF("/assets/models/astronaut.glb");
  const ref = useRef();

  // Media queries for responsiveness
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTiny = useMediaQuery("(max-width: 400px)");

  // State
  const [escaped, setEscaped] = useState(false);
  const [message, setMessage] = useState(
    "Hey! Please don't hover or click me, I prefer staying in one place peacefully!!!."
  );
  const [showButton, setShowButton] = useState(false);
  const [escapeCount, setEscapeCount] = useState(0);
  const [canInteract, setCanInteract] = useState(true);
  const [bounceAnim, setBounceAnim] = useState(false);

  // Config
  const maxEscapes = 3;
  const cooldownTime = 3000; // 3 seconds
  const originalPosition = new THREE.Vector3(0, -1, 0);
  const driftSpeed = 1.5;
  const jitterAmount = 0.05;

  // Animation state refs
  const spinSpeed = useRef(0.002);
  const opacity = useRef(1);

  // Timeout refs
  const cooldownTimeout = useRef();
  const bounceTimeout = useRef();

  // Fun messages for escapes (except first and last)
  const escapeMessages = [
    "Why did you do it again? I'm floating away... again! 😤",
    "Seriously? I’m drifting off! 🚀",
    "You’re persistent! I’m zooming! 🌠",
    "Okay, I’m gone for good... or am I? 👻",
  ];

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Spin the model
    ref.current.rotation.y += spinSpeed.current;

    if (escaped) {
      // Drift away smoothly
      ref.current.position.z -= delta * driftSpeed;

      // Add jitter (small random movements)
      ref.current.position.x =
        originalPosition.x + (Math.random() - 0.5) * jitterAmount;
      ref.current.position.y =
        originalPosition.y + (Math.random() - 0.5) * jitterAmount;

      // Reduce opacity gradually
      opacity.current = Math.max(opacity.current - delta * 0.5, 0.4);
    } else {
      // Smoothly return to original position
      ref.current.position.lerp(originalPosition, 0.1);
      opacity.current = Math.min(opacity.current + delta * 0.5, 1);
    }

    // Apply fading to all materials
    ref.current.traverse((child) => {
      if (child.material && child.material.transparent) {
        child.material.opacity = opacity.current;
      }
    });
  });

  // Prepare model materials for transparency
  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
      }
    });
  }, []);

  // Override raycast to disable interaction while escaped
  useEffect(() => {
    if (!ref.current) return;

    if (escaped) {
      ref.current.traverse((child) => {
        child._originalRaycast = child.raycast;
        child.raycast = () => null;
      });
    } else {
      ref.current.traverse((child) => {
        if (child._originalRaycast) {
          child.raycast = child._originalRaycast;
          delete child._originalRaycast;
        }
      });
    }
  }, [escaped]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimeout.current) clearTimeout(cooldownTimeout.current);
      if (bounceTimeout.current) clearTimeout(bounceTimeout.current);
    };
  }, []);

  function startEscape() {
    if (!canInteract || escaped || escapeCount >= maxEscapes) {
      return;
    }

    whooshSound.play();

    const newCount = escapeCount + 1;
    setEscapeCount(newCount);
    setEscaped(true);
    spinSpeed.current = 0.02;
    setCanInteract(false);

    if (newCount === maxEscapes) {
      setMessage("Okay... I'm staying away now. 😢");
      setShowButton(false);
    } else if (newCount === 1) {
      setMessage("Hey! Why did you do that? Now I'm drifting away! 🚀");
      setShowButton(true);
    } else {
      // Pick a random fun message from array
      const idx = Math.floor(Math.random() * escapeMessages.length);
      setMessage(escapeMessages[idx]);
      setShowButton(true);
    }

    cooldownTimeout.current = setTimeout(() => {
      setCanInteract(true);
    }, cooldownTime);
  }

  function bringBack() {
    popSound.play();
    setEscaped(false);
    spinSpeed.current = 0.002;
    opacity.current = 1;
    setMessage("Thanks for bringing me back! I'll try to stay put now.");
    setShowButton(false);

    // Trigger bounce animation
    setBounceAnim(true);
    bounceTimeout.current = setTimeout(() => setBounceAnim(false), 400);

    if (ref.current) {
      ref.current.position.copy(originalPosition);
    }

    if (escapeCount < maxEscapes) {
      setCanInteract(true);
    }
  }

  return (
    <>
      <group
        onPointerOver={startEscape}
        onClick={startEscape}
        // Add bounce animation to the model group
        scale={bounceAnim ? 1.1 : 1}
      >
        <primitive
          ref={ref}
          object={scene}
          scale={1.5}
          position={originalPosition.toArray()}
          {...props}
        />
      </group>

      <Html
        position={isTiny ? [0, 1.2, 0] : isMobile ? [0, 1.5, 0] : [0, 2, 0]}
        distanceFactor={isMobile ? 8 : 10}
        occlude
        transform
        zIndexRange={[100, 0]}
      >
        <Container>
          <p>{message}</p>
          {showButton && escapeCount < maxEscapes && (
            <Button onClick={bringBack}>Bring me back!</Button>
          )}
        </Container>
      </Html>
    </>
  );
}
