"use client";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

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
  const speedRef = useRef(0);
  const [flipping, setFlipping] = useState(false);

  const caraTexture = useLoader(TextureLoader, "/moneda/cara11.png");
  const cruzTexture = useLoader(TextureLoader, "/moneda/cruz11.png");

  useFrame(() => {
    if (flipping) {
      coinRef.current.rotation.x += speedRef.current;
      coinRef.current.rotation.y += speedRef.current / 2;
      speedRef.current *= 0.98;

      if (speedRef.current < 0.01) {
        setFlipping(false);
        const result = Math.random() > 0.5 ? "Cara" : "Cruz";
        const finalRotation = result === "Cara" ? 0 : Math.PI;
        coinRef.current.rotation.x = finalRotation;
        onFlipEnd(result);
      }
    }
  });

  useEffect(() => {
    if (isFlipping && !flipping) {
      setFlipping(true);
      speedRef.current = 0.3 + Math.random() * 0.2;
    }
  }, [isFlipping]);

  return (
    <mesh
      ref={coinRef}
      rotation={[0, 0, Math.PI / 2]}
      onClick={() => {
        if (!isFlipping && !flipping) {
          onFlipStart();
        }
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <cylinderGeometry args={[0.9, 0.9, 0.05, 64]} />
      <meshStandardMaterial attach="material-1" map={caraTexture} metalness={0.9} roughness={0.2} />
      <meshStandardMaterial attach="material-2" map={cruzTexture} metalness={0.9} roughness={0.2} />
      <meshStandardMaterial attach="material-0" color="silver" metalness={1} roughness={0.3} />

    </mesh>
  );
}
