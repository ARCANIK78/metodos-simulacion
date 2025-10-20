"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface CoinMeshProps {
  isFlipping: boolean;
  onFlipEnd: (result: string) => void;
  onFlipStart: () => void;
}

export default function CoinMesh({
  isFlipping,
  onFlipEnd,
  onFlipStart,
}: CoinMeshProps) {
  const coinRef = useRef<THREE.Mesh>(null!);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useFrame(() => {
    if (flipping) {
      coinRef.current.rotation.x += rotationSpeed;
      coinRef.current.rotation.y += rotationSpeed / 2;
      setRotationSpeed(rotationSpeed * 0.98);

      if (rotationSpeed < 0.01) {
        setFlipping(false);
        const result = Math.random() > 0.5 ? "Cara" : "Cruz";
        const finalRotation = result === "Cara" ? 0 : Math.PI;
        coinRef.current.rotation.x = finalRotation;
        onFlipEnd(result);
      }
    }
  });

  if (isFlipping && !flipping) {
    setFlipping(true);
    setRotationSpeed(0.3 + Math.random() * 0.2);
  }

  return (
    <mesh
      ref={coinRef}
      rotation={[0, 0, Math.PI / 2]}
      onClick={() => {
        if (!isFlipping && !flipping) {
          onFlipStart();
        }
      }}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = "pointer"))}
      onPointerOut={(e) => (e.stopPropagation(), (document.body.style.cursor = "default"))}
    >
      <cylinderGeometry args={[1, 1, 0.2, 64]} />
      <meshStandardMaterial color="gold" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}
