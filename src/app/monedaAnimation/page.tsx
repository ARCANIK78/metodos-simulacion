"use client";

import { Box, Heading, Input, Flex, Text, Button, useDisclosure } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState, useRef } from "react";
import DialogValores from "@/components/dialogFrom_valores";
import ReglasModal from "@/components/dialogFrom_reglas";
import { CanvasSceneRef } from "./CanvasScene";
import RondaTabla from "@/components/tablaRondas";

// Carga diferida del componente 3D
const CanvasScene = dynamic(() => import("./CanvasScene"), { ssr: false });

type Jugada = {
  id: number;
  apuesta: number;
  aleatorio: number;
  gano: boolean;
  saldo: number;
};

type FormValues = {
  apuesta: string;
  dineroInicial: string;
  dineroMax: string;
  rondas: string;
  value: number;
};

export default function Page() {
  const [caraCount, setCaraCount] = useState(0);
  const [cruzCount, setCruzCount] = useState(0);
  const [datosIngresados, setDatosIngresados] = useState<FormValues | null>(null);
  const [simulacion, setSimulacion] = useState<any>(null);

  // Modales
  const { isOpen: isOpenValores, onOpen: onOpenValores, onClose: onCloseValores } = useDisclosure();
  const { isOpen: isOpenReglas, onOpen: onOpenReglas, onClose: onCloseReglas } = useDisclosure();
  const { isOpen: isOpenTabla, onOpen: onOpenTabla, onClose: onCloseTabla } = useDisclosure();

  // Ref para controlar la animación 3D
  const canvasSceneRef = useRef<CanvasSceneRef>(null);

  // Contadores de caras y cruces
  const handleFlipResult = (resultado: string) => {
    if (resultado === "Cara") setCaraCount((c) => c + 1);
    else setCruzCount((c) => c + 1);
  };

  // Función principal de simulación
  const ejecutarRonda = async (datos: FormValues) => {
    setCaraCount(0);
    setCruzCount(0);
    const rondasTotales = parseInt(datos.rondas);
    const dineroInicial = parseFloat(datos.dineroInicial);
    const dineroMax = parseFloat(datos.dineroMax);
    const apuestaBase = parseFloat(datos.apuesta);
    const probabilidad = datos.value;

    const resultadosRondas: any[] = [];

    for (let r = 1; r <= rondasTotales; r++) {
      let saldo = dineroInicial;
      let apuesta = apuestaBase;
      const jugadas: Jugada[] = [];

      while (saldo > 0 && saldo < dineroMax) {
        const aleatorio = Math.floor(Math.random() * 100) + 1;
        const gano = aleatorio <= probabilidad;

        // --- Animación de la moneda ---
        if (canvasSceneRef.current) {
          await canvasSceneRef.current.flipCoin(gano ? "Cara" : "Cruz");
        }

        // --- Lógica del juego ---
        if (gano) {
          saldo += apuesta;
          apuesta = apuestaBase;
        } else {
          saldo -= apuesta;
          apuesta = Math.min(apuesta * 2, saldo);
        }

        // Guardamos cada jugada
        jugadas.push({
          id: jugadas.length + 1,
          aleatorio,
          gano,
          saldo,
          apuesta,
        });
      }

      const resultado = saldo >= dineroMax ? "Ganó" : "Perdió";
      resultadosRondas.push({ ronda: r, resultado, saldoFinal: saldo, jugadas });
    }

    // ✅ Guardar y mostrar todas las rondas al final
    setSimulacion({ rondas: resultadosRondas });
    onOpenTabla();

    console.log("📊 Resultados finales:", resultadosRondas);
  };

  return (
    <Box p={6}>
      {/* --- Encabezado --- */}
      <Flex align="center" justify="space-between" mb={4} wrap="wrap">
        <Heading>Juego de la Moneda</Heading>

        <Flex align="center" gap={3}>
          <Flex direction="column" align="center">
            <Text fontWeight="bold">Cara</Text>
            <Input value={caraCount} isReadOnly textAlign="center" width="80px" />
          </Flex>

          <Flex direction="column" align="center">
            <Text fontWeight="bold">Cruz</Text>
            <Input value={cruzCount} isReadOnly textAlign="center" width="80px" />
          </Flex>

          <Button top="3" colorScheme="green" onClick={onOpenValores}>
            Simular
          </Button>
        </Flex>
      </Flex>

      {/* --- Escena 3D --- */}
      <CanvasScene ref={canvasSceneRef} onFlipResult={handleFlipResult} />

      {/* --- Modales --- */}
      <DialogValores
        isOpen={isOpenValores}
        onClose={onCloseValores}
        onNext={(datos) => {
          setDatosIngresados(datos);
          onCloseValores();
          onOpenReglas();
        }}
      />

      <ReglasModal
        isOpen={isOpenReglas}
        onClose={() => {
          onCloseReglas();
          if (datosIngresados) ejecutarRonda(datosIngresados);
        }}
        datos={datosIngresados}
      />

      {/* --- Modal de resultados finales --- */}
      {simulacion && (
        <RondaTabla
          rondas={simulacion.rondas}
          isOpen={isOpenTabla}
          onClose={onCloseTabla}
        />
      )}
    </Box>
  );
}
