"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";

interface ReglasModalProps {
  isOpen: boolean;
  onClose: () => void;
  datos?: any;
}

export default function ReglasModal({ isOpen, onClose, datos }: ReglasModalProps) {
  const apuesta = parseFloat(datos?.apuesta || "0");
  const dineroInicial = parseFloat(datos?.dineroInicial || "0");
  const dineroMax = parseFloat(datos?.dineroMax || "0");
  const rondas = datos?.rondas || "0";
  const probabilidad = datos?.value ?? "0";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reglas de la Simulación</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={3}>
            <Text><strong>Rondas:</strong> {rondas}</Text>
            <Text><strong>Probabilidad:</strong> {probabilidad}%</Text>
            <Text><strong>Dinero Inicial:</strong> Bs{dineroInicial}</Text>
            <Text><strong>Dinero Máximo:</strong> Bs{dineroMax}</Text>
            <Text><strong>Apuesta Base:</strong> Bs{apuesta}</Text>

            <Text mt={4}>📜 <strong>Reglas del Juego:</strong></Text>
            <Text>1️⃣ Doblar la apuesta cada vez que se pierde.</Text>
            <Text>
              2️⃣ Si se apuesta Bs{apuesta} y se pierde, la siguiente será Bs{apuesta * 2};  
              si vuelve a perder, Bs{apuesta * 4}, y así sucesivamente.
            </Text>
            <Text>
              3️⃣ Si la apuesta supera el dinero disponible, se apuesta todo lo que queda.
            </Text>
            <Text>
              4️⃣ Si gana, la siguiente apuesta vuelve a Bs{apuesta}.
            </Text>
            <Text>5️⃣ La ganancia equivale al monto apostado.</Text>
            <Text>6️⃣ Gana el juego si alcanza Bs{dineroMax}.</Text>
            <Text>7️⃣ Pierde el juego cuando su saldo llega a Bs0.</Text>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
