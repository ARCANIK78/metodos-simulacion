"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnyCard, CARDS_PER_ROUND } from "@/lib/cards";

interface ControlPanelProps {
  rounds: number;
  onRoundsChange: (rounds: number) => void;
  onPlay: () => void;
  onVaciar: () => void;
  cards: AnyCard[];
  currentRound: number;
  jokerMode: boolean;
  onJokerModeChange: (value: boolean) => void;
}

export default function ControlPanel({
  rounds,
  onRoundsChange,
  onPlay,
  onVaciar,
  cards,
  currentRound,
  jokerMode,
  onJokerModeChange,
}: ControlPanelProps) {
  const sectionBg = useColorModeValue("white", "gray.800");

  return (
    <Box p={6} bg={sectionBg} borderRadius="xl" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="md" textAlign="center">CONTROLES</Heading>

        <Box>
          <Text mb={2} fontWeight="bold">Número de rondas:</Text>
          <HStack spacing={3}>
            <NumberInput
              value={rounds}
              onChange={(_, value) => onRoundsChange(value || 1)}
              min={1}
              max={10000}
              size="lg"
              flex={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Badge colorScheme="blue" fontSize="md" px={4} py={2} borderRadius="md">
              Total: <Text as="span" fontWeight="bold" fontSize="lg">{rounds * CARDS_PER_ROUND}</Text>
            </Badge>
          </HStack>
        </Box>

        <FormControl display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <FormLabel htmlFor="joker-mode" mb="0" fontWeight="bold">
              Modo Joker
            </FormLabel>
            <Text fontSize="xs" color="gray.500">
              Posibilidad del 10% de que salga un Joker
            </Text>
          </Box>
          <Switch
            id="joker-mode"
            colorScheme="purple"
            size="lg"
            isChecked={jokerMode}
            onChange={(e) => onJokerModeChange(e.target.checked)}
          />
        </FormControl>

        <HStack spacing={4}>
          <Button colorScheme="green" size="lg" flex={1} onClick={onPlay}>
            JUGAR
          </Button>
          <Button
            colorScheme="red"
            size="lg"
            flex={1}
            onClick={onVaciar}
            isDisabled={cards.length === 0}
          >
            VACIAR
          </Button>
        </HStack>

        {cards.length > 0 && (
          <Box p={4} bg="gray.100" borderRadius="md" textAlign="center" _dark={{ bg: "gray.700" }}>
            <Text fontWeight="bold">
              Ronda actual: {currentRound} | Cartas: {cards.length}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
