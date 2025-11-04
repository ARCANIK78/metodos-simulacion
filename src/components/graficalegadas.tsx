"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Llegada {
  tipoOrden: string;
}

interface GraficaLlegadasProps {
  llegadasPorDia: Llegada[][];
}

const colores = ["#4ade80", "#3b82f6", "#f97316", "#a78bfa", "#ef4444"];

const GraficaLlegadas: React.FC<GraficaLlegadasProps> = ({ llegadasPorDia }) => {
  if (!llegadasPorDia || llegadasPorDia.length === 0) return <p>No hay datos para graficar</p>;

  // Obtener todos los tipos de orden
  const tiposSet = new Set<string>();
  llegadasPorDia.flat().forEach((l) => tiposSet.add(l.tipoOrden));
  const tipos = Array.from(tiposSet);

  // Construir datasets para cada tipo
  const datasets = tipos.map((tipo, idx) => ({
    label: tipo,
    data: llegadasPorDia.map((dia) => dia.filter((l) => l.tipoOrden === tipo).length),
    borderColor: colores[idx % colores.length],
    backgroundColor: colores[idx % colores.length],
    fill: false,
  }));

  const data = {
    labels: llegadasPorDia.map((_, i) => `Día ${i + 1}`),
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Llegadas por tipo y día" },
    },
  };

  return <Line data={data} options={options} />;
};

export default GraficaLlegadas;
