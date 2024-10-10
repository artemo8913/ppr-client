"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalProps {
  isOpen: boolean;
  nearWorkId?: string | number | null;
  openModal: (nearWorkId?: string | number) => void;
  closeModal: () => void;
}
const DEFAULT_VALUE: boolean = false;

const ModalContext = createContext<IWorkModalProps>({
  isOpen: DEFAULT_VALUE,
  openModal: () => {},
  closeModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const WorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpen, setIsModalOpen] = useState(DEFAULT_VALUE);

  const [nearWorkId, setWorkId] = useState<string | number | null>();

  const openModal = useCallback((nearWorkId?: string | number) => {
    setWorkId(nearWorkId);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setWorkId(null);
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ nearWorkId, isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
