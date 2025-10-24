"use client";

import React from "react";
import {
  Box,
  Icon,
  Table,
  TableContainer,
  Thead,
  Th,
  Td,
  Tr,
  Tbody,
  Tfoot,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@chakra-ui/react";
import { LuSmile, LuFrown } from "react-icons/lu";

interface Jugada {
  id: number;
  apuesta: number;
  aleatorio: number;
  gano: boolean;
  saldo: number;
}

interface Ronda {
  ronda: number;
  resultado: string;
  saldoFinal: number;
  jugadas: Jugada[];
}

interface RondaTablaProps {
  rondas: Ronda[];
  isOpen: boolean;
  onClose: () => void;
}

export default function RondaTabla({ rondas, isOpen, onClose }: RondaTablaProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Resultados de la Simulación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {rondas.map((ronda, index) => (
            <Box key={index} mb={6}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Ronda {ronda.ronda} —{" "}
                <Text as="span" color={ronda.resultado === "Ganó" ? "green.400" : "red.400"}>
                  {ronda.resultado}
                </Text>
              </Text>

              <TableContainer borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Table variant="striped" colorScheme="teal" size="sm">
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
                    {ronda.jugadas.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.id}</Td>
                        <Td>{item.apuesta}</Td>
                        <Td isNumeric>{item.aleatorio}</Td>
                        <Td>
                          <Icon
                            as={item.gano ? LuSmile : LuFrown}
                            color={item.gano ? "green.400" : "red.400"}
                            boxSize={4}
                          />
                        </Td>
                        <Td isNumeric>{item.saldo}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th colSpan={5} textAlign="right">
                        <Text color={ronda.resultado === "Ganó" ? "green.400" : "red.400"} fontWeight="bold">
                          {ronda.resultado}
                        </Text>
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>

              {index < rondas.length - 1 && <Divider my={5} />}
            </Box>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
