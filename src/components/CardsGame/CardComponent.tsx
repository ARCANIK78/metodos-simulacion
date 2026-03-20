"use client";

import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import { AnyCard, CardData, getSuitSymbol, isRedSuit, isJoker } from "@/lib/cards";

interface CardComponentProps {
  card: AnyCard;
  size?: "sm" | "md" | "lg";
}

const CARD_SIZES = {
  sm: { w: "70px", h: "100px" },
  md: { w: "90px", h: "130px" },
  lg: { w: "110px", h: "160px" },
};

export default function CardComponent({ card, size = "md" }: CardComponentProps) {
  const isJokerCard = isJoker(card);
  const { w, h } = CARD_SIZES[size];

  if (isJokerCard) {
    return (
      <Box
        w={w}
        h={h}
        borderRadius="md"
        border="2px solid"
        borderColor="gray.800"
        boxShadow="md"
        position="relative"
        overflow="hidden"
      >
        <Image
          src="/img/carta-de-el-joker-poker.jpg"
          alt="Joker"
          fill
          style={{ objectFit: "cover", transform: "scale(1.1)" }}
          unoptimized
        />
      </Box>
    );
  }

  const regularCard = card as CardData;
  const color = isRedSuit(regularCard.suit) ? "red.600" : "gray.800";
  const symbol = getSuitSymbol(regularCard.suit);
  const padding = size === "sm" ? 1 : size === "md" ? 2 : 3;
  const fontSize = size === "sm" ? "xs" : size === "md" ? "sm" : "md";
  const symbolSize = size === "sm" ? "3xl" : size === "md" ? "4xl" : "5xl";

  return (
    <Box
      w={w}
      h={h}
      bg="white"
      borderRadius="md"
      border="2px solid"
      borderColor={color}
      boxShadow="md"
      position="relative"
      _dark={{ bg: "gray.100" }}
    >
      <Box position="absolute" top={padding} left={padding}>
        <Text fontSize={fontSize} fontWeight="bold" color={color} lineHeight={1}>
          {regularCard.rank}
        </Text>
        <Text fontSize={fontSize} color={color} lineHeight={1} mt={-1}>
          {symbol}
        </Text>
      </Box>

      <Box
        position="absolute"
        bottom={padding}
        right={padding}
        transform="rotate(180deg)"
      >
        <Text fontSize={fontSize} fontWeight="bold" color={color} lineHeight={1}>
          {regularCard.rank}
        </Text>
        <Text fontSize={fontSize} color={color} lineHeight={1} mt={-1}>
          {symbol}
        </Text>
      </Box>

      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Text fontSize={symbolSize} color={color}>
          {symbol}
        </Text>
      </Box>
    </Box>
  );
}
