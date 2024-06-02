"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalProps {
  isOpen: boolean;
  indexToPlace?: number;
  openModal: (workIndex?: number) => void;
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
  const [indexToPlace, setWorkIndex] = useState<number>();
  const openModal = useCallback((workIndex?: number) => {
    setWorkIndex(workIndex);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setWorkIndex(undefined);
    setIsModalOpen(false);
  }, []);
  return (
    <ModalContext.Provider value={{ indexToPlace, isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
