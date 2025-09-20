"use client";
import { extendTheme, type ThemeConfig, type StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";



const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

export default theme;
