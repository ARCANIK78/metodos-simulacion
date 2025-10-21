"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 1, 10]} intensity={10} />
    </>
  );
}
