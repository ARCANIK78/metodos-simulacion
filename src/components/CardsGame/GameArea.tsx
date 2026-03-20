"use client";

import { Box, VStack, Heading, Text, SimpleGrid, Flex, useColorModeValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { AnyCard } from "@/lib/cards";
import CardComponent from "./CardComponent";

const MotionBox = motion.create(Box);

interface GameAreaProps {
  cards: AnyCard[];
}

export default function GameArea({ cards }: GameAreaProps) {
  const sectionBg = useColorModeValue("white", "gray.800");

  return (
    <Box p={6} bg={sectionBg} borderRadius="xl" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Heading size="md" textAlign="center">ÁREA DE JUEGO</Heading>

        {cards.length === 0 ? (
          <Flex
            h="300px"
            align="center"
            justify="center"
            border="2px dashed"
            borderColor="gray.400"
            borderRadius="lg"
          >
            <Text color="gray.500" fontSize="lg">
              Presiona JUGAR para generar cartas
            </Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
            <AnimatePresence mode="popLayout">
              {cards.map((card, i) => (
                <MotionBox
                  key={card.id}
                  initial={{ opacity: 0, y: -50, rotateZ: -10, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateZ: 0, 
                    scale: 1,
                    transition: {
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.5, y: 50 }}
                  layout
                >
                  <CardComponent card={card} />
                </MotionBox>
              ))}
            </AnimatePresence>
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
}
