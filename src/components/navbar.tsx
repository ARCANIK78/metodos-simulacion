"use client";

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useBreakpointValue,
  Icon,
  Collapse,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  MoonIcon,
  CloseIcon,
  SunIcon,
  HamburgerIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import NextLink from 'next/link';


// -------------------- Componentes de Navegación --------------------
export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Botón Hamburger móvil */}
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>

        {/* Logo y DesktopNav */}
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        {/* Botón Dark/Light + Avatar */}
        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src="https://www.shutterstock.com/shutterstock/photos/2033137370/display_1500/stock-vector-programmer-computer-expert-black-linear-icon-man-coding-on-laptop-freelance-software-developer-2033137370.jpg"
                />
              </MenuButton>
              <MenuList alignItems="center">
                <Center>
                  <Avatar
                    size="2xl"
                    src="https://www.shutterstock.com/shutterstock/photos/2033137370/display_1500/stock-vector-programmer-computer-expert-black-linear-icon-man-coding-on-laptop-freelance-software-developer-2033137370.jpg"
                  />
                </Center>
                <Center>
                  <Text fontSize="lg">Username</Text>
                </Center>
                <MenuDivider />
                <MenuItem fontSize="md">Your Servers</MenuItem>
                <MenuItem fontSize="md">Account Settings</MenuItem>
                <MenuItem fontSize="md">Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>

      {/* MobileNav dentro de Collapse */}
      <Collapse in={isOpen} animateOpacity>
      {<MobileNav /> as ReactNode}
    </Collapse>
    </Box>
  );
}

// -------------------- Navegación Desktop --------------------
const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.id}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Box
                as={NextLink}
                href={navItem.href ?? "#"}
                p={2}
                fontSize="lg"
                fontWeight={500}
                color={linkColor}
                _hover={{ textDecoration: "none", color: linkHoverColor }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.id} {...child} />
                    ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as={NextLink}
      href={href ?? "#"}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
            fontSize="lg"
          >
            {label}
          </Text>
          {subLabel && <Text fontSize="md">{subLabel}</Text>}
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="pink.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

// --------------------- Navegación Mobile -----------------
const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
    <MobileNavItem key={navItem.id} {...navItem} />
    ))}

    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
       as={NextLink}
       href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Text fontWeight={600} color={useColorModeValue("gray.600", "gray.200")} fontSize="lg">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align="start"
        >
          {children?.map((child) => (
            <Box as={NextLink}  key={child.id} py={2} href={child.href} fontSize="md">
                {child.label}
            </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// -------------------- Tipos y datos --------------------
interface NavItem {
id: string; 
  label: string;
  subLabel?: string;
  children?: NavItem[];
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/"
  },
  {
    id: "generacion",
    label: "Generación de números",
    children: [
      { 
        id: "mix-congruential",
        label: "Método Congruencial Mixto", 
        subLabel: "Genera números aleatorios usando una combinación de multiplicación y adición", 
        href: "/mix-congruential"
      },
      { 
        id: "mult-congruential",
        label: "Método Congruencial Multiplicativo", 
        subLabel: "Genera números aleatorios multiplicando por una constante.", 
        href: "/mult-congruential"
      }
    ],
  },
  {
    id: "math1",
    label: "Math Tools",
    children: [
      { id: "mcm", label: "MCM & Período", subLabel: "Calcula mínimo común múltiplo y período máximob", href: "/mcm" },
      { id: "freelance", label: "Freelance Projects", subLabel: "An exclusive list for contract work", href: "#" },
    ],
  },
  { id: "after2", 
    label: "Simulacion", 
    children: [
      {id: "monedaAnimation", label: "Moneda3D", subLabel: "Juegos de Volados ", href: "/monedaAnimation" },
      {id: "Simulacion", label: "M/M/S Ventillas de un Banco", subLabel: "Análisis de colas M/M/s en las ventanillas de un banco", href: "MMS_Banco" }
    ], 
  },
  { id: "after3", label: "after", href: "#" },
];
