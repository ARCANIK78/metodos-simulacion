"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lights from "./components/Lights";
import CoinMesh from "./components/CoinMesh";
import { useState } from "react";

interface SceneProps {
  onFlipResult: (result: string) => void;
}

export default function SceneContent({ onFlipResult }: SceneProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFlipEnd = (res: string) => {
    setIsFlipping(false);
    setResult(res);
    onFlipResult(res);
  };

  // Iniciar flip (se llamará desde CoinMesh al hacer click)
  const handleFlipStart = () => {
    if (!isFlipping) {
      setResult(null);
      setIsFlipping(true);
    }
  };

  return (
    <>
      <Canvas
        style={{ width: "100%", height: "500px" }}
        camera={{ position: [2, 2, 4], fov: 60 }}
      >
        <Lights />
        <CoinMesh
          isFlipping={isFlipping}
          onFlipEnd={handleFlipEnd}
          onFlipStart={handleFlipStart}
        />
        <OrbitControls />
      </Canvas>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        {result && <h3>Resultado: {result}</h3>}
      </div>
    </>
  );
}
