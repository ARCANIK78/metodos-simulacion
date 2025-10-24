"use client";
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import SceneContent from "./SceneContent";

interface CanvasSceneProps {
  onFlipResult: (result: string) => void;
  triggerFlip?: boolean;        // ← agregamos
  onFlipComplete?: () => void;  // ← agregamos
}

export interface CanvasSceneRef {
  flipCoin: (result: "Cara" | "Cruz") => Promise<void>;
}

const CanvasScene = forwardRef<CanvasSceneRef, CanvasSceneProps>(
  ({ onFlipResult, triggerFlip, onFlipComplete }, ref) => {
    const sceneRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      flipCoin: (result: "Cara" | "Cruz") => {
        return new Promise<void>((resolve) => {
          if (sceneRef.current) {
            sceneRef.current.startFlip(result, () => resolve());
          } else {
            resolve();
          }
        });
      },
    }));

    // Si triggerFlip cambia a true, ejecutamos una animación automática
    useEffect(() => {
      if (triggerFlip && sceneRef.current) {
        const result = Math.random() < 0.5 ? "Cara" : "Cruz";
        sceneRef.current.startFlip(result, () => {
          if (onFlipComplete) onFlipComplete();
        });
      }
    }, [triggerFlip, onFlipComplete]);

    return <SceneContent ref={sceneRef} onFlipResult={onFlipResult} />;
  }
);

export default CanvasScene;
