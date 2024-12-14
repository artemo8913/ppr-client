"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { IPprData } from "@/2entities/ppr";

interface IWorkModalProps {
  isOpenAddWorkModal: boolean;
  isOpenEditWorkModal: boolean;
  workMeta: IPprData | null;
  closeAddWorkModal: () => void;
  closeEditWorkModal: () => void;
  openAddWorkModal: (nearWork?: IPprData) => void;
  openEditWorkModal: (work: IPprData) => void;
}

const ModalContext = createContext<IWorkModalProps>({
  workMeta: null,
  isOpenAddWorkModal: false,
  isOpenEditWorkModal: false,
  openAddWorkModal: () => {},
  closeAddWorkModal: () => {},
  openEditWorkModal: () => {},
  closeEditWorkModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const PprWorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpenAddWorkModal, setIsOpenAddWorkModal] = useState(false);

  const [isOpenEditWorkModal, setIsOpenEditWorkModal] = useState(false);

  const [workMeta, setWorkMeta] = useState<IPprData | null>(null);

  const openAddWorkModal = useCallback((nearWorkMeta?: IPprData) => {
    if (nearWorkMeta) {
      setWorkMeta(nearWorkMeta);
    } else {
      setWorkMeta(null);
    }
    setIsOpenAddWorkModal(true);
  }, []);

  const closeAddWorkModal = useCallback(() => {
    setWorkMeta(null);
    setIsOpenAddWorkModal(false);
  }, []);

  const openEditWorkModal = useCallback((workMeta: IPprData) => {
    setWorkMeta(workMeta);
    setIsOpenEditWorkModal(true);
  }, []);

  const closeEditWorkModal = useCallback(() => {
    setWorkMeta(null);
    setIsOpenEditWorkModal(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        workMeta,
        isOpenAddWorkModal,
        isOpenEditWorkModal,
        openAddWorkModal,
        closeAddWorkModal,
        openEditWorkModal,
        closeEditWorkModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
