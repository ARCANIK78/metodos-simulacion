"use client";
import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Text,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Range } from "react-range";

const formSchema = z.object({
  s: z
    .string()
    .min(1, { message: "Ingrese el número de servidores (s)" })
    .refine((val) => Number.isInteger(parseFloat(val)) && parseInt(val) > 0, {
      message: "Debe ser un número entero positivo",
    }),
  servicios: z
    .array(
      z.object({
        nombre: z.string(),
        porcentaje: z
          .string()
          .min(1, { message: "Ingrese porcentaje" })
          .refine(
            (val) =>
              !isNaN(parseFloat(val)) &&
              parseFloat(val) >= 0 &&
              parseFloat(val) <= 100,
            { message: "Debe ser un número entre 0 y 100" }
          ),
      })
    )
    .min(1)
    .refine(
      (arr) => arr.reduce((acc, s) => acc + parseFloat(s.porcentaje), 0) === 100,
      { message: "La suma de los porcentajes debe ser 100" }
    ),
  fallo: z.boolean(),
  tiempoFallo: z.number().min(1).max(10).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DialogMMSProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: FormValuesConSlider) => void;
}

interface FormValuesConSlider extends FormValues {
  sliderValues: number[];
  serverValues: number[];
}

const serviciosBase = [
  { nombre: "Atención general (caja)", porcentaje: "40" },
  { nombre: "Plataforma de servicios", porcentaje: "25" },
  { nombre: "Créditos / préstamos", porcentaje: "20" },
  { nombre: "Atención empresarial", porcentaje: "15" },
];

export default function DialogMMS({ isOpen, onClose, onNext }: DialogMMSProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      s: "",
      servicios: serviciosBase,
      fallo: false,
      tiempoFallo: 1,
    },
  });

  const { fields } = useFieldArray({ name: "servicios", control });
  const sValue = useWatch({ control, name: "s" });
  const fallo = watch("fallo");

  const STEP = 1;
  const MIN = 0;
  const MAX = 100;

  const [values, setValues] = React.useState<number[]>([40, 65, 85]);
  const [serverValues, setServerValues] = React.useState<number[]>([]);

  useEffect(() => {
    const sNum = parseInt(sValue || "0");
    if (!isNaN(sNum) && sNum > 1) {
      const step = Math.floor(100 / sNum);
      const newValues = Array.from({ length: sNum - 1 }, (_, i) => (i + 1) * step);
      setServerValues(newValues);
    } else {
      setServerValues([]);
    }
  }, [sValue]);

  const onSubmit = (data: FormValues) => {
    onNext({ ...data, sliderValues: values, serverValues });
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Parámetros del Sistema de Colas (Banco)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="form-mms" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.s}>
                <FormLabel>s (Cantidad de servidores)</FormLabel>
                <Input {...register("s")} placeholder="Ej: 3" />
                <FormErrorMessage>{errors.s?.message}</FormErrorMessage>
              </FormControl>

              {serverValues.length > 0 && (
                <>
                  <Text fontWeight="bold" fontSize="lg" mt={4}>
                    Distribución de servidores activos (%)
                  </Text>

                  <VStack mt={4} spacing={4}>
                    <Range
                      values={serverValues}
                      step={STEP}
                      min={MIN}
                      max={MAX}
                      onChange={(vals) => setServerValues(vals)}
                      renderTrack={({ props, children }) => (
                        <div
                          {...props}
                          style={{
                            ...props.style,
                            height: "4px",
                            width: "100%",
                            backgroundColor: "#CBD5E0",
                            borderRadius: "2px",
                          }}
                        >
                          {children}
                        </div>
                      )}
                      renderThumb={({ props, index }) => {
                        const { key, ...thumbProps } = props;
                        return (
                          <div
                            key={key}
                            {...thumbProps}
                            style={{
                              ...thumbProps.style,
                              height: "24px",
                              width: "24px",
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                              border: "4px solid #3182ce",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text fontSize="xs">{serverValues[index]}</Text>
                          </div>
                        );
                      }}
                    />

                    <VStack align="stretch" mt={2} spacing={1}>
                      {Array.from({ length: parseInt(sValue) || 0 }).map((_, i) => {
                        const start = i === 0 ? 0 : serverValues[i - 1] + 1;
                        const end = i < serverValues.length ? serverValues[i] : 100;
                        return (
                          <Text key={i}>
                            {start}-{end}: servidor {i + 1}
                          </Text>
                        );
                      })}
                    </VStack>
                  </VStack>
                </>
              )}

              <Text fontWeight="bold" fontSize="lg" mt={4}>
                Distribución de servicios (%)
              </Text>

              <VStack mt={4} spacing={4}>
                <Range
                  values={values}
                  step={STEP}
                  min={MIN}
                  max={MAX}
                  onChange={(vals) => setValues(vals)}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "4px",
                        width: "100%",
                        backgroundColor: "#CBD5E0",
                        borderRadius: "2px",
                      }}
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => {
                    const { key, ...thumbProps } = props;
                    return (
                      <div
                        key={key}
                        {...thumbProps}
                        style={{
                          ...thumbProps.style,
                          height: "24px",
                          width: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                          border: "4px solid #3182ce",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text fontSize="xs">{values[index]}</Text>
                      </div>
                    );
                  }}
                />

                <VStack align="stretch" mt={2} spacing={1}>
                  {fields.map((f, i) => {
                    const start = i === 0 ? 0 : values[i - 1] + 1;
                    const end = i < values.length ? values[i] : 100;
                    return (
                      <Text key={i}>
                        {start}-{end}: {f.nombre}
                      </Text>
                    );
                  })}
                </VStack>
              </VStack>

              {/* Checkbox de fallo */}
              <FormControl>
                <Checkbox
                  {...register("fallo")}
                  onChange={(e) => setValue("fallo", e.target.checked)}
                >
                  ¿Existe un fallo en el sistema?
                </Checkbox>
              </FormControl>

              {/* Si hay fallo, mostrar duración */}
              {fallo && (
                <FormControl>
                  <FormLabel>Duración del fallo (horas)</FormLabel>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    {...register("tiempoFallo", { valueAsNumber: true })}
                  />
                  <Text fontSize="sm" color="gray.500">
                    El fallo puede durar entre 1 y 10 horas.
                  </Text>
                </FormControl>
              )}
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="teal" type="submit" form="form-mms">
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
