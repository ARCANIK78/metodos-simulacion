"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import DialogMMS from "@/components/DialogMMS";
import dayjs from "dayjs";
import GraficaLlegadas from "@/components/graficalegadas";
// Heroicons
import { 
  UserIcon, 
  BanknotesIcon, 
  CreditCardIcon, 
  ClockIcon, 
  ExclamationTriangleIcon 
} from "@heroicons/react/24/solid";

interface Llegada {
  hora: string | null;
  numeroAleatorioCaja: number | null;
  caja: number | null;
  numeroAleatorioTipo: number | null;
  tipoOrden: string;
}

interface MMSData {
  servicios: { nombre: string; porcentaje: string }[];
  sliderValues: number[];
  s: string;
  fallo?: boolean;
  tiempoFallo?: number;
}

export default function MMSBancoPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [llegadas, setLlegadas] = useState<Llegada[]>([]);
  const [historialLlegadas, setHistorialLlegadas] = useState<Llegada[][]>([]);
  const [diaActual, setDiaActual] = useState<number>(0);
  
  const [servicios, setServicios] = useState<any[]>([]);
  const [sliderValues, setSliderValues] = useState<number[]>([40, 65, 85]);
  const [numServidores, setNumServidores] = useState<number>(1);
  const [fallo, setFallo] = useState<boolean>(false);
  const [tiempoFallo, setTiempoFallo] = useState<number>(0);

  const bgNormal = useColorModeValue("white", "gray.700");
  const colorNormal = useColorModeValue("gray.800", "white");
  const [mostrarGrafica, setMostrarGrafica] = useState(false);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleNext = (data: MMSData) => {
    setServicios(data.servicios);
    setSliderValues(data.sliderValues);
    setNumServidores(parseInt(data.s));
    setFallo(data.fallo || false);
    setTiempoFallo(data.tiempoFallo || 0);
    generarLlegadas(data.servicios, data.sliderValues, parseInt(data.s), data.fallo, data.tiempoFallo);
    onClose();
  };

  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const seleccionarServicioPorcentaje = (servicios: any[], values: number[], numero: number) => {
    for (let i = 0; i < values.length; i++) {
      if (numero <= values[i]) return servicios[i].nombre;
    }
    return servicios[servicios.length - 1].nombre;
  };

  const seleccionarCajaPorcentaje = (numero: number, s: number) => {
    const rango = 100 / s;
    for (let i = 1; i <= s; i++) {
      if (numero <= rango * i) return i;
    }
    return s;
  };

  const tiemposServicio: Record<string, number> = {
    "Atención general (caja)": 5,
    "Créditos / préstamos": 15,
    "Plataforma de servicios": 10,
    "Atención empresarial": 20,
  };

  const iconosServicios: Record<string, React.ReactNode> = {
    "Atención general (caja)": <BanknotesIcon width={20} height={20} />,
    "Créditos / préstamos": <CreditCardIcon width={20} height={20} />,
    "Plataforma de servicios": <UserIcon width={20} height={20} />,
    "Atención empresarial": <ClockIcon width={20} height={20} />,
    "Fallo": <ExclamationTriangleIcon width={20} height={20} />,
  };

  const bgServicio = (tipo: string) => {
    if (tipo.includes("Fallo")) return "red.600";
    return bgNormal;
  };

  const generarLlegadas = (
    servicios: any[],
    values: number[],
    s: number,
    hayFallo?: boolean,
    duracionFallo?: number
  ) => {
    const filas: Llegada[] = [];
    let hora = dayjs().startOf("day").hour(8);
    const horaFin = dayjs().startOf("day").hour(15);

    const falloHoy = hayFallo ? Math.random() < 0.4 : false;
    const horaFallo = falloHoy ? getRandomInt(8, 14) : null;

    while (hora.isBefore(horaFin)) {
      const minutosEntreLlegadas = getRandomInt(1, 10);
      hora = hora.add(minutosEntreLlegadas, "minute");
      if (hora.isAfter(horaFin)) break;

      if (falloHoy && hora.hour() === horaFallo) {
        filas.push({
          hora: hora.format("HH:mm"),
          numeroAleatorioCaja: null,
          caja: null,
          numeroAleatorioTipo: null,
          tipoOrden: "Fallo del sistema",
        });
        hora = hora.add((duracionFallo || 1) * 60, "minute");
        if (hora.isAfter(horaFin)) break;
      }

      const numeroAleatorioCaja = getRandomInt(0, 100);
      const caja = seleccionarCajaPorcentaje(numeroAleatorioCaja, s);

      const numeroAleatorioTipo = getRandomInt(0, 100);
      const tipoOrden = seleccionarServicioPorcentaje(servicios, values, numeroAleatorioTipo);

      const tiempoServicio = tiemposServicio[tipoOrden] || 5;

      filas.push({
        hora: hora.format("HH:mm"),
        numeroAleatorioCaja,
        caja,
        numeroAleatorioTipo,
        tipoOrden,
      });

      for (let c = 2; c <= caja; c++) {
        const numeroAleatorioTipoExtra = getRandomInt(0, 100);
        const tipoOrdenExtra = seleccionarServicioPorcentaje(servicios, values, numeroAleatorioTipoExtra);
        filas.push({
          hora: null,
          numeroAleatorioCaja: null,
          caja: null,
          numeroAleatorioTipo: numeroAleatorioTipoExtra,
          tipoOrden: tipoOrdenExtra,
        });
      }

      hora = hora.add(tiempoServicio, "minute");
    }

    setHistorialLlegadas((prev) => [...prev, filas]);
    setDiaActual((prev) => prev + 1);
    setLlegadas(filas);
  };

  // 🎬 Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Modelo M/M/S – Banco
      </Text>

      <DialogMMS isOpen={isOpen} onClose={onClose} onNext={handleNext} />

      {llegadas.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Box mt={6} overflowX="auto">
            <Text fontSize="lg" fontWeight="semibold" mb={2}>
              Día {diaActual} - Tabla de llegadas (con tiempo de servicio y posibles fallos)
            </Text>

            <Table variant="simple" size="md" colorScheme="gray">
              <Thead bg="gray.800" position="sticky" top={0}>
                <Tr>
                  <Th color="white">N°</Th>
                  <Th color="white">Hora</Th>
                  <Th color="white">Nº Aleatorio (caja)</Th>
                  <Th color="white">Caja</Th>
                  <Th color="white">Nº Aleatorio (tipo)</Th>
                  <Th color="white">Tipo de Orden</Th>
                </Tr>
              </Thead>
              <Tbody>
                {llegadas.map((llegada, index) => (
                  <Tr
                    key={index}
                    bg={bgServicio(llegada.tipoOrden)}
                    color={llegada.tipoOrden.includes("Fallo") ? "white" : colorNormal}
                  >
                    <Td>{index + 1}</Td>
                    <Td>{llegada.hora ?? "-"}</Td>
                    <Td>{llegada.numeroAleatorioCaja ?? "-"}</Td>
                    <Td>{llegada.caja ?? "-"}</Td>
                    <Td>{llegada.numeroAleatorioTipo ?? "-"}</Td>
                    <Td display="flex" alignItems="center">
                      <Box boxSize={5} mr={2}>
                        {llegada.tipoOrden === "Fallo"
                          ? iconosServicios["Fallo"]
                          : iconosServicios[llegada.tipoOrden]}
                      </Box>
                      <Text>{llegada.tipoOrden}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Box display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                      gap={4}
                      mt={6}>
              <Button
                mt={4}
                colorScheme="teal"
                onClick={() =>
                  generarLlegadas(servicios, sliderValues, numServidores, fallo, tiempoFallo)
                }
              >
                Generar día siguiente
              </Button>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => setMostrarGrafica((prev) => !prev)}
              >
                {mostrarGrafica ? "Ocultar gráfica" : "Generar gráfica"}
              </Button>

            </Box>
            
            {mostrarGrafica && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <Box mt={6}>
                  {/*Resumen general */}
                   {/* 📊 Resumen general (cards arriba de la gráfica) */}
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                      gap={4}
                      mt={6}
                    >
                      {[
                        {
                          label: "Total de Órdenes",
                          valor: historialLlegadas.flat().length - historialLlegadas.flat().filter(l => l.tipoOrden.includes("Fallo")).length,
                          icono: <UserIcon width={24} height={24} />,
                          color: "blue.500",
                        },
                        {
                          label: "Atención general",
                          valor: historialLlegadas.flat().filter(l => l.tipoOrden === "Atención general (caja)").length,
                          icono: <BanknotesIcon width={24} height={24} />,
                          color: "green.400",
                        },
                        {
                          label: "Plataforma de servicios",
                          valor: historialLlegadas.flat().filter(l => l.tipoOrden === "Plataforma de servicios").length,
                          icono: <UserIcon width={24} height={24} />,
                          color: "teal.400",
                        },
                        {
                          label: "Créditos / préstamos",
                          valor: historialLlegadas.flat().filter(l => l.tipoOrden === "Créditos / préstamos").length,
                          icono: <CreditCardIcon width={24} height={24} />,
                          color: "purple.400",
                        },
                        {
                          label: "Atención empresarial",
                          valor: historialLlegadas.flat().filter(l => l.tipoOrden === "Atención empresarial").length,
                          icono: <ClockIcon width={24} height={24} />,
                          color: "orange.400",
                        },
                        {
                          label: "Fallo del sistema",
                          valor: historialLlegadas.flat().filter(l => l.tipoOrden.includes("Fallo")).length,
                          icono: <ExclamationTriangleIcon width={24} height={24} />,
                          color: "red.500",
                        },
                      ].map((item, idx) => (
                        <Box
                          key={idx}
                          bg={bgNormal}
                          p={4}
                          borderRadius="xl"
                          boxShadow="sm"
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          borderLeft={`6px solid ${item.color}`}
                        >
                          <Box>
                            <Text fontWeight="medium" fontSize="sm" color={colorNormal}>{item.label}</Text>
                            <Text fontSize="2xl" fontWeight="bold" color={colorNormal}>{item.valor}</Text>
                          </Box>
                          <Box color={item.color} aria-hidden>
                            {item.icono}
                          </Box>
                        </Box>
                      ))}
                    </Box>


                  <Text fontSize="lg" fontWeight="semibold" mb={2}>
                    Gráfica de llegadas acumuladas
                  </Text>
                  <GraficaLlegadas llegadasPorDia={historialLlegadas} />
                </Box>
              </motion.div>
            )}
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
