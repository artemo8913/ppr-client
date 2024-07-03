"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalProps {
  isOpen: boolean;
  nearWorkId?: string;
  openModal: (nearWorkId?: string) => void;
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
  const [nearWorkId, setNearWorkId] = useState<string>();
  const openModal = useCallback((nearWorkId?: string) => {
    setNearWorkId(nearWorkId);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setNearWorkId(undefined);
    setIsModalOpen(false);
  }, []);
  return (
    <ModalContext.Provider value={{ nearWorkId, isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
