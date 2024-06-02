"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
const defaultValue: boolean = false;

const ModalContext = createContext<IWorkModalProps>({
  isOpen: defaultValue,
  openModal: () => {},
  closeModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const WorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpen, setIsModalOpen] = useState(defaultValue);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  return <ModalContext.Provider value={{ isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>;
};

export const useWorkModal = () => useContext(ModalContext);
