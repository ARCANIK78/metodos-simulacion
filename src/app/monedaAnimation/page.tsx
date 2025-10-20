"use client";

import { Box, Heading, Input, Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const CanvasScene = dynamic(() => import("./CanvasScene"), { ssr: false });

export default function Page() {
  const [caraCount, setCaraCount] = useState(0);
  const [cruzCount, setCruzCount] = useState(0);

  const handleFlipResult = (result: string) => {
    if (result === "Cara") setCaraCount((c) => c + 1);
    else setCruzCount((c) => c + 1);
  };

  return (
    <Box p={6}>
      <Flex align="center" justify="space-between" mb={4} wrap="wrap">
        <Heading>Juego de la Moneda </Heading>

        <Flex align="center" gap={3}>
          <Flex direction="column" align="center">
            <Text fontWeight="bold">Cara</Text>
            <Input
              value={caraCount}
              isReadOnly
              textAlign="center"
              width="80px"
            />
          </Flex>

          <Flex direction="column" align="center">
            <Text fontWeight="bold">Cruz</Text>
            <Input
              value={cruzCount}
              isReadOnly
              textAlign="center"
              width="80px"
            />
          </Flex>
        </Flex>
      </Flex>

      {/* Escena */}
      <CanvasScene onFlipResult={handleFlipResult} />
    </Box>
  );
}
