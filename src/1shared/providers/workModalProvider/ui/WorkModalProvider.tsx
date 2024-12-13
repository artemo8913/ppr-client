"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { IPprData } from "@/2entities/ppr";

interface IWorkModalProps {
  isOpen: boolean;
  nearWorkMeta: Partial<IPprData>;
  openModal: (nearWorkMeta?: Partial<IPprData>) => void;
  closeModal: () => void;
}
const DEFAULT_VALUE: boolean = false;

const ModalContext = createContext<IWorkModalProps>({
  nearWorkMeta: {},
  isOpen: DEFAULT_VALUE,
  openModal: () => {},
  closeModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const WorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpen, setIsModalOpen] = useState(DEFAULT_VALUE);

  const [nearWorkMeta, setNearWorkMeta] = useState<Partial<IPprData>>({});

  const openModal = useCallback((nearWorkMeta?: Partial<IPprData>) => {
    if (nearWorkMeta) {
      setNearWorkMeta(nearWorkMeta);
    } else {
      setNearWorkMeta({});
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setNearWorkMeta({});
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ nearWorkMeta, isOpen, closeModal, openModal }}>{children}</ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
