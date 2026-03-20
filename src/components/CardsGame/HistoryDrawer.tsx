"use client";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnyCard, RANKS, SUITS, SUIT_SYMBOLS, isRedSuit, isJoker } from "@/lib/cards";
import { useMemo } from "react";

interface HistoryDrawerProps {
  history: AnyCard[][];
}

export default function HistoryDrawer({ history }: HistoryDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  const stats = useMemo(() => {
    const allCards = history.flat();
    const countMap: Record<string, number> = {};
    let jokerCount = 0;

    allCards.forEach((card) => {
      if (isJoker(card)) {
        jokerCount++;
      } else {
        const key = `${card.rank}-${card.suit}`;
        countMap[key] = (countMap[key] || 0) + 1;
      }
    });

    return { countMap, jokerCount };
  }, [history]);

  const totalCards = useMemo(() => history.flat().length, [history]);
  const totalGames = history.length;

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen} position="fixed" bottom={6} right={6} zIndex={10}>
        Ver Historial ({totalGames} juegos)
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader>Historial de Cartas</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={2} spacing={4}>
                <Stat bg={cardBg} p={4} borderRadius="lg">
                  <StatLabel>Total de Juegos</StatLabel>
                  <StatNumber>{totalGames}</StatNumber>
                </Stat>
                <Stat bg={cardBg} p={4} borderRadius="lg">
                  <StatLabel>Total de Cartas</StatLabel>
                  <StatNumber>{totalCards}</StatNumber>
                </Stat>
              </SimpleGrid>

              {stats.jokerCount > 0 && (
                <Box bg="purple.100" p={4} borderRadius="lg" _dark={{ bg: "purple.900" }}>
                  <HStack>
                    <Text fontSize="2xl">🃏</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">Jokers</Text>
                      <Badge colorScheme="purple" fontSize="lg">{stats.jokerCount}</Badge>
                    </VStack>
                  </HStack>
                </Box>
              )}

              <Divider />

              <Text fontWeight="bold" fontSize="lg">Frecuencia por Carta</Text>

              <Box maxH="400px" overflowY="auto">
                <VStack spacing={2} align="stretch">
                  {SUITS.map((suit) => (
                    <Box key={suit}>
                      <HStack mb={2}>
                        <Box fontSize="xl" fontWeight="bold" color={isRedSuit(suit) ? "red.600" : "gray.800"}>
                          {SUIT_SYMBOLS[suit]}
                        </Box>
                        <Text fontWeight="bold" textTransform="capitalize">{suit}</Text>
                      </HStack>
                      <SimpleGrid columns={4} spacing={2}>
                        {RANKS.map((rank) => {
                          const key = `${rank}-${suit}`;
                          const count = stats.countMap[key] || 0;
                          const color = isRedSuit(suit) ? "red.600" : "gray.800";

                          return (
                            <Box
                              key={key}
                              bg={cardBg}
                              p={2}
                              borderRadius="md"
                              textAlign="center"
                            >
                              <Box fontSize="sm" fontWeight="bold" color={color}>
                                {rank} {SUIT_SYMBOLS[suit]}
                              </Box>
                              <Badge colorScheme={count > 0 ? "green" : "gray"}>
                                {count}
                              </Badge>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Divider />

              <Text fontWeight="bold" fontSize="lg">Resumen por Palo</Text>
              <SimpleGrid columns={2} spacing={4}>
                {SUITS.map((suit) => {
                  const suitCount = RANKS.reduce((acc, rank) => {
                    return acc + (stats.countMap[`${rank}-${suit}`] || 0);
                  }, 0);

                  return (
                    <Box key={suit} bg={cardBg} p={4} borderRadius="lg">
                      <HStack>
                        <Box fontSize="2xl" color={isRedSuit(suit) ? "red.600" : "gray.800"}>
                          {SUIT_SYMBOLS[suit]}
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" textTransform="capitalize">{suit}</Text>
                          <Text fontWeight="bold">{suitCount} cartas</Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
