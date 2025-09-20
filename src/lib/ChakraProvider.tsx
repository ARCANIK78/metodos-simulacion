"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { ReactNode } from "react";

export default function ChakraWrapper({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
