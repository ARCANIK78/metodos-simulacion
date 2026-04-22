"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
} from "@chakra-ui/react";

interface Aguja {
  x: number;
  y: number;
  angulo: number;
  length: number;
  cruza: boolean;
}

export default function AgujaBuffon() {
  const [n, setN] = useState(50);
  const [l, setL] = useState(0.7);
  const [t, setT] = useState(1.0);
  const [agujas, setAgujas] = useState<Aguja[]>([]);
  const [stats, setStats] = useState({ total: 0, cruces: 0 });

  const numLineas = 8;

  const generarAgujas = useCallback(() => {
    const nuevas: Aguja[] = [];
    let crucesCount = 0;
    
    for (let i = 0; i < n; i++) {
      const x = Math.random() * numLineas * t;
      const y = Math.random();
      const angulo = Math.random() * Math.PI;
      const longitudX = l * Math.cos(angulo);
      const x2 = x + longitudX;
      const cruza = Math.floor(x / t) !== Math.floor(x2 / t);
      if (cruza) crucesCount++;
      nuevas.push({ x, y, angulo, length: l, cruza });
    }
    
    setAgujas(nuevas);
    setStats({ total: n, cruces: crucesCount });
  }, [n, l, t]);

  const aproxPi = stats.cruces > 0 ? (2 * l * stats.total) / (t * stats.cruces) : 0;
  const error = stats.total > 0 ? Math.abs(Math.PI - aproxPi) / Math.PI * 100 : 100;

  return (
    <Box p={6}>
      <Heading size="lg" mb={1}>
        Aguja de Buffon
      </Heading>
      <Text mb={4} color="gray.500" fontSize="sm">
        Pi ≈ 2 · L · n / (t × cruces)
      </Text>

      <Flex gap={4} mb={4} wrap="wrap" align="center">
        <Box w="180px">
          <Text fontSize="sm" mb={1}>n: {n}</Text>
          <Slider value={n} onChange={(val) => setN(val)} min={5} max={200} step={5} colorScheme="blue">
            <SliderTrack><SliderFilledTrack /></SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        
        <Box w="100px">
          <Text fontSize="sm" mb={1}>L: {l.toFixed(1)}</Text>
          <Slider value={l} onChange={(val) => setL(val)} min={0.3} max={1} step={0.1} colorScheme="green">
            <SliderTrack><SliderFilledTrack /></SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        
        <Box w="100px">
          <Text fontSize="sm" mb={1}>t: {t.toFixed(1)}</Text>
          <Slider value={t} onChange={(val) => setT(val)} min={0.5} max={1} step={0.1} colorScheme="purple">
            <SliderTrack><SliderFilledTrack /></SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>

        <Button colorScheme="blue" onClick={generarAgujas}>
          Lanzar
        </Button>
      </Flex>

      <Box
        position="relative"
        w="100%"
        h="350px"
        bg="white"
        border="2px solid"
        borderColor="black"
        borderRadius="md"
        mb={4}
        overflow="hidden"
      >
        {[...Array(numLineas - 1)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            left={0}
            right={0}
            top={`${((i + 1) / numLineas) * 100}%`}
            h="2px"
            bg="black"
            opacity={0.4}
          />
        ))}
        
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {agujas.map((a, i) => {
            const x1Pct = (a.x / (numLineas * t)) * 100;
            const x2Pct = x1Pct + ((a.length * Math.cos(a.angulo)) / (numLineas * t)) * 100;
            const yPct = a.y * 100;
            
            return (
              <line
                key={i}
                x1={`${x1Pct}%`}
                y1={`${yPct}%`}
                x2={`${x2Pct}%`}
                y2={`${yPct}%`}
                stroke={a.cruza ? "#16a34a" : "#dc2626"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </Box>

      <SimpleGrid columns={4} spacing={3} mb={4}>
        <Box bg="blue.50" p={3} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">n</Text>
          <Text fontSize="xl" fontWeight="bold">{stats.total}</Text>
        </Box>
        <Box bg="green.50" p={3} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">cruces</Text>
          <Text fontSize="xl" fontWeight="bold" color="green.600">{stats.cruces}</Text>
        </Box>
        <Box bg="red.50" p={3} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">no cruza</Text>
          <Text fontSize="xl" fontWeight="bold" color="red.600">{stats.total - stats.cruces}</Text>
        </Box>
        <Box bg="purple.100" p={3} borderRadius="md" textAlign="center">
          <Text fontSize="xs" color="gray.600">Pi</Text>
          <Text fontSize="xl" fontWeight="bold" color="purple.600">{aproxPi.toFixed(4)}</Text>
        </Box>
      </SimpleGrid>

      <Box
        p={4}
        bg="gray.50"
        borderRadius="lg"
        textAlign="center"
        border="3px solid"
        borderColor="purple.500"
      >
        <Text fontSize="sm" color="gray.500">π ≈</Text>
        <Text fontSize="4xl" fontWeight="bold" color="purple.600">{aproxPi.toFixed(4)}</Text>
        <Text fontSize="xs" color="gray.400">error: {error.toFixed(2)}%</Text>
      </Box>
    </Box>
  );
}