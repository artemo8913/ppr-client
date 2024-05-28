"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IModalProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
const defaultValue: boolean = false;

const ModalContext = createContext<IModalProps>({
  isOpen: defaultValue,
  openModal: () => {},
  closeModal: () => {},
});

interface IModalProviderProps extends PropsWithChildren {}

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const [isOpen, setIsModalOpen] = useState(defaultValue);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  return <ModalContext.Provider value={{ isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>;
};

export const useModal = () => useContext(ModalContext);
