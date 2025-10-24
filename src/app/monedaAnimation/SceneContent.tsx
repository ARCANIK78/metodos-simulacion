"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lights from "./components/Lights";
import CoinMesh from "./components/CoinMesh";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";

interface SceneProps {
  onFlipResult: (result: string) => void;
}

const SceneContent = forwardRef(({ onFlipResult }: SceneProps, ref) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [onComplete, setOnComplete] = useState<(() => void) | null>(null);
  const resultRef = useRef<"Cara" | "Cruz" | null>(null);

  useImperativeHandle(ref, () => ({
    startFlip: (res: "Cara" | "Cruz", callback: () => void) => {
    if (!isFlipping) {
      setIsFlipping(true);
      resultRef.current = res; // ← el resultado viene de flipCoin
      setOnComplete(() => callback); 
      setTimeout(() => handleFlipEnd(res), 1200);
    }
  },
  }));

  const handleFlipEnd = (res: string) => {
    setIsFlipping(false);
    setResult(res);
    onFlipResult(res);
    if (onComplete) onComplete();
  };

  // 👉 Nuevo: para girar al hacer clic manualmente
  const handleClickCoin = () => {
    if (!isFlipping) {
      const res = Math.random() < 0.5 ? "Cara" : "Cruz";
      setIsFlipping(true);
      resultRef.current = res;
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
          onFlipStart={() => {}}
          onFlipEnd={handleFlipEnd}
          onClick={handleClickCoin}  
        />
        <OrbitControls />
      </Canvas>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        {result && <h3>Resultado: {result}</h3>}
      </div>
    </>
  );
});

export default SceneContent;
