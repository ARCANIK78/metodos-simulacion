"use client";
import React from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Button, Input, FormControl, FormLabel,
  FormErrorMessage, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, Stack,
} from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const formSchema = z.object({
  apuesta: z.string().min(1, { message: "Ingrese una cantidad válida" }), // nuevo campo
  dineroInicial: z.string().min(1, { message: "Ingrese una cantidad válida" }),
  dineroMax: z.string().min(1, { message: "Ingrese una cantidad válida" }),
  rondas: z.string().min(1, { message: "Ingrese el número de rondas" }),
  value: z.number(),
}).refine(
  (data) => parseFloat(data.dineroMax) > parseFloat(data.dineroInicial),
  {
    path: ["dineroMax"],
    message: "El dinero máximo debe ser mayor que el dinero inicial",
  }
);

type FormValues = z.infer<typeof formSchema>;

interface DialogValoresProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: FormValues) => void;
}

export default function DialogValores({ isOpen, onClose, onNext }: DialogValoresProps) {
  const { control, handleSubmit, register, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { apuesta: "", dineroInicial: "", dineroMax: "", rondas: "", value: 70 },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Datos ingresados:", data);
    onNext(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ingresar valores</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="form-valores" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.apuesta}>
                <FormLabel>Valor de la Apuesta (X)</FormLabel>
                <Input {...register("apuesta")} placeholder="Ej: 10" />
                <FormErrorMessage>{errors.apuesta?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dineroInicial}>
                <FormLabel>Dinero Inicial (Xinicio)</FormLabel>
                <Input {...register("dineroInicial")} placeholder="Ej: 100" />
                <FormErrorMessage>{errors.dineroInicial?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.dineroMax}>
                <FormLabel>Dinero Máximo (Xmax)</FormLabel>
                <Input {...register("dineroMax")} placeholder="Ej: 200" />
                <FormErrorMessage>{errors.dineroMax?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.rondas}>
                <FormLabel>Cantidad de Rondas (R)</FormLabel>
                <Input {...register("rondas")} placeholder="Ej: 5" />
                <FormErrorMessage>{errors.rondas?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.value}>
                <FormLabel>Rango de Probabilidad (P 1–100)</FormLabel>
                <Controller
                  name="value"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Slider min={0} max={100} step={1} value={field.value} onChange={field.onChange}>
                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <div style={{ marginTop: 8, fontWeight: 600 }}>{field.value}%</div>
                    </>
                  )}
                />
                <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
              </FormControl>
            </Stack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="teal" type="submit" form="form-valores">
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
