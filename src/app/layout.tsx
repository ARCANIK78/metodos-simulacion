import { ReactNode } from "react";
import theme from "@/lib/theme";
import Nav from "@/components/navbar";
import { ChakraProvider } from "@chakra-ui/react";

export const metadata = {
  title: "methods-simulation",
  description: "methods-simulation",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <Nav />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
