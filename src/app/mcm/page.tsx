"use client";

import { useState } from "react";
import { Box, Heading, Input, Button, Text, Stack, RadioGroup, Radio } from "@chakra-ui/react";

// Función para MCD
const mcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Función para MCM
const mcm = (a: number, b: number): number => (a * b) / mcd(a, b);

// Factorización prima
const factorizarPrimos = (n: number): Record<number, number> => {
  const factores: Record<number, number> = {};
  let num = n;
  let div = 2;
  while (num > 1) {
    if (num % div === 0) {
      factores[div] = (factores[div] || 0) + 1;
      num = num / div;
    } else {
      div++;
    }
  }
  return factores;
};

// Totiente de Euler
const totiente = (p: number, e: number): number => p ** e - p ** (e - 1);

export default function Page() {
  const [modo, setModo] = useState<"mcm" | "periodo">("mcm");
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    if (modo === "mcm") {
      if (num1 > 0 && num2 > 0) {
        setResultado(mcm(num1, num2));
      } else {
        setResultado(null);
      }
    } else if (modo === "periodo") {
      if (num1 > 0) {
        const factores = factorizarPrimos(num1);
        let periodoMaximo = 1;
        for (const pStr in factores) {
          const p = parseInt(pStr);
          const e = factores[p];
          const t = totiente(p, e);
          periodoMaximo = mcm(periodoMaximo, t);
        }
        setResultado(periodoMaximo);
      } else {
        setResultado(null);
      }
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Calculadora MCM / Período Máximo</Heading>
      <Stack spacing={4} maxW="400px">
        <RadioGroup onChange={(v) => setModo(v as "mcm" | "periodo")} value={modo} defaultValue="mcm">
          <Stack direction="row">
            <Radio value="mcm">MCM(n1, n2)</Radio>
            <Radio value="periodo">Período máximo (m)</Radio>
          </Stack>
        </RadioGroup>

        <Input
          type="number"
          placeholder={modo === "mcm" ? "Número 1" : "Módulo m"}
          value={num1}
          onChange={(e) => setNum1(parseInt(e.target.value))}
        />

        {modo === "mcm" && (
          <Input
            type="number"
            placeholder="Número 2"
            value={num2}
            onChange={(e) => setNum2(parseInt(e.target.value))}
          />
        )}

        <Button colorScheme="blue" onClick={calcular}>
          Calcular
        </Button>

        {resultado !== null && (
          <Text fontSize="lg" fontWeight="bold">
            {modo === "mcm" ? `MCM = ${resultado}` : `Período máximo teórico = ${resultado}`}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
