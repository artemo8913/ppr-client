"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

interface IWorkModalProps {
  isOpen: boolean;
  workId?: string | number | null;
  openModal: (workId?: string | number) => void;
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

  const [workId, setWorkId] = useState<string | number | null>();

  const openModal = useCallback((workId?: string | number) => {
    setWorkId(workId);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setWorkId(null);
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ workId, isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
