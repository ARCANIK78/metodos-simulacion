"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={6} />
      <directionalLight position={[20, 1, 50]} intensity={10} />
    </>
  );
}
