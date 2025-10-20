"use client";
import SceneContent from "./SceneContent";

interface CanvasSceneProps {
  onFlipResult: (result: string) => void;
}

export default function CanvasScene({ onFlipResult }: CanvasSceneProps) {
  return <SceneContent onFlipResult={onFlipResult} />;
}
