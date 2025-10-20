"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={1} />
    </>
  );
}
