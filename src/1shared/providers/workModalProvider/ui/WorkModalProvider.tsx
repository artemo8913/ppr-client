"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

export interface INearWorkMeta {
  workId?: TPprDataWorkId;
  branch?: TWorkBranch;
  subbranch?: string;
}

interface IWorkModalProps {
  isOpen: boolean;
  nearWorkMeta: INearWorkMeta;
  openModal: ({ workId, branch, subbranch }: INearWorkMeta) => void;
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

  const [nearWorkMeta, setNearWorkMeta] = useState<INearWorkMeta>({});

  const openModal = useCallback((nearWorkMeta: INearWorkMeta) => {
    setNearWorkMeta(nearWorkMeta);
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
