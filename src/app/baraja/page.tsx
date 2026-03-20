"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { generateCards, CARDS_PER_ROUND, AnyCard } from "@/lib/cards";
import { ControlPanel, GameArea, HistoryDrawer } from "@/components/CardsGame";

export default function PlayGame() {
  const [rounds, setRounds] = useState(1);
  const [cards, setCards] = useState<AnyCard[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundId, setRoundId] = useState(0);
  const [history, setHistory] = useState<AnyCard[][]>([]);
  const [jokerMode, setJokerMode] = useState(false);

  const bg = useColorModeValue("gray.50", "gray.900");

  const handlePlay = () => {
    const totalCards = rounds * CARDS_PER_ROUND;
    const newCards = generateCards(totalCards, jokerMode);
    setHistory((prev) => [...prev, newCards]);
    setCards(newCards);
    setCurrentRound(rounds);
    setRoundId((prev) => prev + 1);
  };

  const handleVaciar = () => {
    setCards([]);
    setHistory([]);
    setCurrentRound(0);
  };

  return (
    <Box minH="100vh" bg={bg} py={8}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          <Heading size="xl">JUEGO DE CARTAS</Heading>

          <Flex w="full" gap={6} direction={{ base: "column", md: "row" }}>
            <Box flex="1">
              <ControlPanel
                rounds={rounds}
                onRoundsChange={setRounds}
                onPlay={handlePlay}
                onVaciar={handleVaciar}
                cards={cards}
                currentRound={currentRound}
                jokerMode={jokerMode}
                onJokerModeChange={setJokerMode}
              />
            </Box>
            <Box flex="2">
              <GameArea key={roundId} cards={cards} />
            </Box>
          </Flex>
        </VStack>
      </Container>

      <HistoryDrawer history={history} />
    </Box>
  );
}
