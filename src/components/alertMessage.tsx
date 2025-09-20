// components/ErrorModal.tsx
"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}

export const ErrorModal = ({ isOpen, onClose, title, description }: ErrorModalProps) => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {description && <Text>{description}</Text>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
