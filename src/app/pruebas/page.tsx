"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Collapse,
  Text,
  Icon,
  Table,
  TableContainer,
  Thead,
  Th,
  Td,
  Tr,
  Tbody,
  Tfoot,
  useDisclosure,
} from "@chakra-ui/react";
import { LuChevronRight, LuSmile, LuFrown } from "react-icons/lu";

interface Jugada {
  id: number;
  apuesta: number;
  aleatorio: number;
  gano: boolean;
  saldo: number;
}

interface RondaTablaProps {
  ronda: number;
  jugadas: Jugada[];
}

export default function RondaTabla({ ronda, jugadas }: RondaTablaProps) {
  const { isOpen, onToggle } = useDisclosure();

  const totalSaldo = jugadas.reduce((acc, item) => acc + item.saldo, 0);
  const ganoTotal = jugadas[jugadas.length - 1]?.gano;

  return (
    <Box p={4} borderWidth="2px" rounded="md" shadow="sm" mb={4}>
      {/* Encabezado colapsable */}
      <Flex
        align="center"
        gap={2}
        cursor="pointer"
        onClick={onToggle}
        p={2}
        rounded="md"
        bg="gray.100"
      >
        <Icon
          as={LuChevronRight}
          boxSize={5}
          transition="transform 0.2s ease"
          transform={isOpen ? "rotate(90deg)" : "rotate(0deg)"}
        />
        <Text fontWeight="medium">Ronda {ronda}</Text>
      </Flex>

      {/* Contenido colapsable */}
      <Collapse in={isOpen} animateOpacity>
        <Box mt={2} p={3} borderWidth="1px" rounded="md">
          <TableContainer>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Nr</Th>
                  <Th>Apuesta</Th>
                  <Th isNumeric>x(Aleatorio)</Th>
                  <Th>G/P</Th>
                  <Th isNumeric>Saldo</Th>
                </Tr>
              </Thead>

              <Tbody>
                {jugadas.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.apuesta}</Td>
                    <Td isNumeric>{item.aleatorio}</Td>
                    <Td>
                      <Icon
                        as={item.gano ? LuSmile : LuFrown}
                        color={item.gano ? "green.400" : "red.400"}
                        boxSize={5}
                      />
                    </Td>
                    <Td isNumeric>{item.saldo}</Td>
                  </Tr>
                ))}
              </Tbody>

              {/* Fila final */}
              <Tfoot>
                <Tr>
                  <Th colSpan={5} textAlign="right">
                    <Text color={ganoTotal ? "green.400" : "red.400"} fontWeight="bold">
                      {ganoTotal ? "Ganó" : "Perdió"}
                    </Text>
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Box>
  );
}
