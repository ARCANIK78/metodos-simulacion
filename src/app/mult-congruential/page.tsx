"use client";

import {
  Box,
  Heading,
  Stack,
  Flex,
  Button,
  Input,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { ErrorModal } from "@/components/alertMessage";

interface Resultado {
  i: number;
  Xn: number;
  operacion: number;
  uniforme: number;
}

export default function MultCongruential() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [x0, setX0] = useState<number | "">("");
  const [a, setA] = useState<number | "">("");
  const [m, setM] = useState<number | "">("");
  const [result, setResult] = useState<Resultado[]>([]);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);

  // 🔹 Estados para paginación
  const [page, setPage] = useState(0);
  const pageSize = 100; // cantidad de filas por página

  const generar = () => {
    const numX0 = Number(x0);
    const numA = Number(a);
    const numM = Number(m);

    if (!numM || numM <= 0) return;

    if (numX0 % 2 === 0 || numX0 % 5 === 0) {
      setError({
        title: "Error en la semilla",
        description: "X₀ debe ser impar y no divisible entre 2 y 5.",
      });
      return;
    }

    const nums: Resultado[] = [];
    const seen = new Set<number>();
    let Xn = numX0;
    let i = 0;

    while (!seen.has(Xn) && i < numM) {
      const oper = (numA * Xn) % numM;
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
    setPage(0); // volver a inicio cuando se genere
  };

  const totalPages = Math.ceil(result.length / pageSize);
  const currentData = result.slice(page * pageSize, (page + 1) * pageSize);

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
        <Heading size="lg">Método Congruencial Multiplicativo</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Ayuda
        </Button>
      </Flex>

      {/* Inputs */}
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
            placeholder="m"
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            onFocus={() => setM("")}
          />
          <Button colorScheme="green" onClick={generar}>
            Generar
          </Button>
        </Flex>

        {/* Modal de error */}
        <ErrorModal
          isOpen={!!error}
          onClose={() => setError(null)}
          title={error?.title || ""}
          description={error?.description}
        />
      </Stack>

      {/* Resultados en tabla */}
      {currentData.length > 0 && (
        <Box mt={6} overflowX="auto">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>i</Th>
                <Th>Xn</Th>
                <Th>(a*Xn)%m</Th>
                <Th>Uniforme</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentData.map((row) => (
                <Tr key={row.i}>
                  <Td>{row.i}</Td>
                  <Td>{row.Xn}</Td>
                  <Td>{row.operacion}</Td>
                  <Td>{row.uniforme.toFixed(4)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Controles de paginación */}
          <Flex justify="center" align="center" gap={2} mt={4}>
            <Button onClick={() => setPage(0)} isDisabled={page === 0}>
              ⏮ Inicio
            </Button>
            <Button onClick={() => setPage((p) => Math.max(p - 1, 0))} isDisabled={page === 0}>
              ◀ Anterior
            </Button>
            <Box>
              Página {page + 1} de {totalPages}
            </Box>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              isDisabled={page >= totalPages - 1}
            >
              Siguiente ▶
            </Button>
            <Button onClick={() => setPage(totalPages - 1)} isDisabled={page >= totalPages - 1}>
              ⏭ Final
            </Button>
          </Flex>
        </Box>
      )}

      {/* Modal de Ayuda */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ayuda - Método Congruencial Multiplicativo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Este método genera números aleatorios multiplicando por una constante y aplicando módulo.
              <br />
              Fórmula: Xₙ₊₁ = (a * Xₙ) mod m
              <br />
              Donde:
              <br />• X₀: semilla inicial
              <br />• a: multiplicador
              <br />• m: módulo
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
