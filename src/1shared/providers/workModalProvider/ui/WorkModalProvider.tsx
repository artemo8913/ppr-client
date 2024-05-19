"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalControlProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
const defaultValue: boolean = false;

const WorkDataContext = createContext<IWorkModalControlProps>({
  isOpen: defaultValue,
  openModal: () => {},
  closeModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const WorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpen, setIsModalOpen] = useState(defaultValue);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  return <WorkDataContext.Provider value={{ isOpen, closeModal, openModal }}>{children}</WorkDataContext.Provider>;
};

export const useWorkModal = () => useContext(WorkDataContext);
