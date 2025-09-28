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
  Xn: bigint;
  operacion: bigint;
  uniforme: number;
}

// Exponenciación modular rápida: a^b mod m
const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e % 2n === 1n) result = (result * b) % mod;
    b = (b * b) % mod;
    e = e / 2n;
  }
  return result;
};

export default function MultCongruential() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [x0, setX0] = useState<number | "">("");
  const [a, setA] = useState<number | "">("");
  const [m, setM] = useState<number | "">("");
  const [result, setResult] = useState<Resultado[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 100;
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [directPage, setDirectPage] = useState<number | "">("");

  const calcularPagina = (page: number) => {
    if (!x0 || !a || !m) return;

    const numX0 = BigInt(x0);
    const numA = BigInt(a);
    const numM = BigInt(m);

    if (numM <= 0n) return;

    if (numX0 % 2n === 0n || numX0 % 5n === 0n) {
      setError({
        title: "Error en la semilla",
        description: "X₀ debe ser impar y no divisible entre 2 y 5.",
      });
      return;
    }

    const startIndex = BigInt(page * pageSize);
    let Xn = (modPow(numA, startIndex, numM) * numX0) % numM;

    const nums: Resultado[] = [];
    for (let i = 0; i < pageSize && startIndex + BigInt(i) < numM; i++) {
      const oper = (numA * Xn) % numM;
      nums.push({
        i: Number(startIndex + BigInt(i)),
        Xn,
        operacion: oper,
        uniforme: Number(oper) / Number(numM),
      });
      Xn = oper;
    }

    setResult(nums);
  };

  const generar = () => {
    setPage(0);
    calcularPagina(0);
  };

  const irPagina = () => {
    if (directPage === "" || directPage < 1) return;
    const newPage = Number(directPage) - 1;
    setPage(newPage);
    calcularPagina(newPage);
  };

  const inputProps = {
    w: "90px",
    type: "number",
    textAlign: "center" as const,
    _placeholder: { color: useColorModeValue("gray.400", "gray.500") },
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Método Congruencial Multiplicativo</Heading>
        <Button colorScheme="blue" onClick={onOpen}>Ayuda</Button>
      </Flex>

      <Stack spacing={4} textAlign="center">
        <Heading size="md">Ingrese valores</Heading>
        <Flex align="center" justify="center" gap={3} wrap="wrap">
          <Input {...inputProps} placeholder="X₀" value={x0} onChange={(e) => setX0(Number(e.target.value))} onFocus={() => setX0("")} />
          <Input {...inputProps} placeholder="a" value={a} onChange={(e) => setA(Number(e.target.value))} onFocus={() => setA("")} />
          <Input {...inputProps} placeholder="m" value={m} onChange={(e) => setM(Number(e.target.value))} onFocus={() => setM("")} />
          <Button colorScheme="green" onClick={generar}>Generar</Button>
          <Flex justify="center" align="center" gap={2} mt={2}>
            <Input {...inputProps} placeholder="Ir a página" value={directPage} onChange={(e) => setDirectPage(Number(e.target.value))} />
            <Button colorScheme="purple" onClick={irPagina}>Ir</Button>
          </Flex>
        </Flex>

        

        <ErrorModal isOpen={!!error} onClose={() => setError(null)} title={error?.title || ""} description={error?.description} />
      </Stack>

      {result.length > 0 && (
        <Box mt={6} overflowX="auto">
          <Table variant="striped">
            <Thead>
              <Tr><Th>i</Th><Th>Xn</Th><Th>(a*Xn)%m</Th><Th>Uniforme</Th></Tr>
            </Thead>
            <Tbody>
              {result.map((row) => (
                <Tr key={row.i}>
                  <Td>{row.i}</Td>
                  <Td>{row.Xn.toString()}</Td>
                  <Td>{row.operacion.toString()}</Td>
                  <Td>{row.uniforme.toFixed(4)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justify="center" align="center" gap={2} mt={4}>
            <Button onClick={() => { setPage(0); calcularPagina(0); }} isDisabled={page === 0}>⏮ Inicio</Button>
            <Button onClick={() => { const newPage = Math.max(page - 1, 0); setPage(newPage); calcularPagina(newPage); }} isDisabled={page === 0}>◀ Anterior</Button>
            <Box>Página {page + 1}</Box>
            <Button onClick={() => { const newPage = page + 1; setPage(newPage); calcularPagina(newPage); }} isDisabled={result.length < pageSize}>Siguiente ▶</Button>
          </Flex>
        </Box>
      )}

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
              <br />
              <br />
              Con paginación "lazy" y exponenciación modular, puedes saltar directo a cualquier página sin colgar la página.
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
