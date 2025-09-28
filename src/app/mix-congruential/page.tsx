"use client";

import {
  Box,
  Heading,
  Stack,
  Flex,
  Button,
  Input,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useState } from "react";

interface Resultado {
  i: number;
  Xn: number;
  operacion: number;
  uniforme: number;
}

export default function MixCongruential() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [x0, setX0] = useState<number | "">("");
  const [a, setA] = useState<number | "">("");
  const [c, setC] = useState<number | "">("");
  const [m, setM] = useState<number | "">("");
  const [result, setResult] = useState<Resultado[]>([]);

  const generar = () => {
    const numX0 = Number(x0);
    const numA = Number(a);
    const numC = Number(c);
    const numM = Number(m);

    if (!numM || numM <= 0) return;

    const nums: Resultado[] = [];
    const seen = new Set<number>();
    let Xn = numX0;
    let i = 0;

    while (!seen.has(Xn)) {
      const oper = (numA * Xn + numC) % numM;
      nums.push({
        i,
        Xn,
        operacion: oper,
        uniforme: oper / numM,
      });
      seen.add(Xn);
      Xn = oper;
      i++;
    }

    setResult(nums);
  };

  const inputProps = {
    w: "70px",
    type: "number",
    textAlign: "center" as const,
    _placeholder: { color: useColorModeValue("gray.400", "gray.500") },
  };

  return (
    <Box p={8}>
      {/* Título y Ayuda */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Método Congruencial Mixto</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Ayuda
        </Button>
      </Flex>

      {/* Inputs y botón Generar */}
      <Stack spacing={4} textAlign="center">
        <Heading size="md">Ingrese valores</Heading>
        <Flex align="center" justify="center" gap={3} wrap="wrap">
          <Input
            {...inputProps}
            placeholder="X₀"
            value={x0}
            onChange={(e) => setX0(Number(e.target.value))}
            onFocus={() => setX0("")}
          />
          <Input
            {...inputProps}
            placeholder="a"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            onFocus={() => setA("")}
          />
          <Input
            {...inputProps}
            placeholder="c"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            onFocus={() => setC("")}
          />
          <Input
            {...inputProps}
            placeholder="m"
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            onFocus={() => setM("")}
          />
          <Button colorScheme="green" onClick={generar}>
            Generar
          </Button>
        </Flex>
      </Stack>

      {/* Resultados en tabla */}
      {result.length > 0 && (
        <Box mt={6} overflowX="auto">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>i</Th>
                <Th>Xn</Th>
                <Th>(a*Xn+c)%m</Th>
                <Th>Uniforme</Th>
              </Tr>
            </Thead>
            <Tbody>
              {result.map((row) => (
                <Tr key={row.i}>
                  <Td>{row.i}</Td>
                  <Td>{row.Xn}</Td>
                  <Td>{row.operacion}</Td>
                  <Td>{row.uniforme.toFixed(4)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modal de Ayuda */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ayuda - Método Congruencial Mixto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Este método genera números aleatorios usando una combinación de multiplicación y adición.
              <br />
              Fórmula: Xₙ₊₁ = (a * Xₙ + c) mod m
              <br />
              Donde:
              <br />• X₀: semilla inicial
              <br />• a: multiplicador
              <br />• c: constante aditiva
              <br />• m: módulo
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
/*m=32, Xo=49, a=17 , c=21*/
