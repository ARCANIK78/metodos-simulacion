"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ComposedChart,
  Line,
} from "recharts";

interface Punto {
  x: number;
  y: number;
  enCirculo: boolean;
}

export default function MonteCarlo() {
  const [n, setN] = useState(100);
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [stats, setStats] = useState({ total: 0, enCirculo: 0 });

  const generarPuntos = useCallback(() => {
    const nuevos: Punto[] = [];
    let dentro = 0;
    
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 4;
      const y = Math.random() * 4;
      const distancia = Math.sqrt((x - 2) ** 2 + (y - 2) ** 2);
      const dentroCirculo = distancia <= 2;
      if (dentroCirculo) dentro++;
      nuevos.push({ x, y, enCirculo: dentroCirculo });
    }
    
    setPuntos(nuevos);
    setStats({ total: n, enCirculo: dentro });
  }, [n]);

  const aproxPi = stats.total > 0 ? (4 * stats.enCirculo) / stats.total : 0;
  
  const datosCirculo = useMemo(() => {
    const puntos: {x: number, y: number}[] = [];
    for (let angulo = 0; angulo <= 360; angulo += 5) {
      const rad = (angulo * Math.PI) / 180;
      puntos.push({
        x: 2 + 2 * Math.cos(rad),
        y: 2 + 2 * Math.sin(rad),
      });
    }
    return puntos;
  }, []);

  return (
    <Box p={8}>
      <Heading size="lg" mb={2}>
        Método Monte Carlo - Estimación de Pi
      </Heading>
      <Text mb={6} color="gray.500" fontSize="sm">
        Lanzamos puntos aleatorios en un cuadrado con círculo inscrito.
        Pi ≈ 4 × (puntos en círculo) / (puntos totales)
      </Text>

      <Flex gap={8} mb={6} wrap="wrap">
        <Box flex="1" minW="200px">
          <Text mb={2} fontWeight="bold">Número de puntos (n): {n}</Text>
          <Slider
            value={n}
            onChange={(val) => setN(val)}
            min={10}
            max={2000}
            step={10}
            colorScheme="blue"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        
        <Flex gap={4} align="center">
          <Box
            as="button"
            px={6}
            py={2}
            bg="blue.500"
            color="white"
            borderRadius="md"
            fontWeight="bold"
            onClick={generarPuntos}
            _hover={{ bg: "blue.600" }}
          >
            Generar
          </Box>
        </Flex>
      </Flex>

      <Box
        w="100%"
        h="400px"
        mb={6}
        border="2px solid"
        borderColor="gray.300"
        borderRadius="md"
        overflow="hidden"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 4]}
              allowDuplicatedCategory={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 4]}
              allowDuplicatedCategory={false}
            />
            <ReferenceLine x={0} stroke="black" strokeWidth={2} />
            <ReferenceLine x={4} stroke="black" strokeWidth={2} />
            <ReferenceLine y={0} stroke="black" strokeWidth={2} />
            <ReferenceLine y={4} stroke="black" strokeWidth={2} />
            <Line
              type="monotone"
              data={datosCirculo}
              dataKey="y"
              stroke="transparent"
              fill="none"
            />
            <Scatter name="Puntos" data={puntos} isAnimationActive={false}>
              {puntos.map((p, i) => (
                <Cell
                  key={i}
                  fill={p.enCirculo ? "#48BB78" : "#E53E3E"}
                  r={3}
                />
              ))}
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

      <SimpleGrid columns={4} spacing={4} mb={6}>
        <Box p={4} bg="blue.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="gray.600">Total</Text>
          <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
        </Box>
        <Box p={4} bg="green.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="gray.600">En círculo</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.600">{stats.enCirculo}</Text>
        </Box>
        <Box p={4} bg="red.50" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="gray.600">Fuera</Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.600">{stats.total - stats.enCirculo}</Text>
        </Box>
        <Box p={4} bg="purple.100" borderRadius="md" textAlign="center">
          <Text fontSize="sm" color="gray.600">Pi ≈</Text>
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            {aproxPi.toFixed(4)}
          </Text>
        </Box>
      </SimpleGrid>

      <Box
        p={6}
        bg="gray.50"
        borderRadius="lg"
        textAlign="center"
        border="2px solid"
        borderColor="purple.300"
      >
        <Text fontSize="lg" color="gray.600">Resultado</Text>
        <Text fontSize="5xl" fontWeight="bold" color="purple.600">
          π ≈ {aproxPi.toFixed(4)}
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          Pi real: 3.1416
        </Text>
      </Box>
    </Box>
  );
}