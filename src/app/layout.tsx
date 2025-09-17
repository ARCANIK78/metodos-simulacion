"use client";
import { ReactNode } from "react";
import theme from "@/theme";
import Nav from "@/components/navbar";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Evita el flash de color */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Nav />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
