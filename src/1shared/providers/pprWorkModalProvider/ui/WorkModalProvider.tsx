"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { IPprData } from "@/2entities/ppr";

interface IWorkModalProps {
  isOpenAddWorkModal: boolean;
  workMeta: Partial<IPprData>;
  openAddWorkModal: (nearWork?: Partial<IPprData>) => void;
  closeAddWorkModal: () => void;
}
const DEFAULT_VALUE: boolean = false;

const ModalContext = createContext<IWorkModalProps>({
  workMeta: {},
  isOpenAddWorkModal: DEFAULT_VALUE,
  openAddWorkModal: () => {},
  closeAddWorkModal: () => {},
});

interface IWorkModalProviderProps extends PropsWithChildren {}

export const PprWorkModalProvider: FC<IWorkModalProviderProps> = ({ children }) => {
  const [isOpenAddWorkModal, setIsOpenAddWorkModal] = useState(DEFAULT_VALUE);

  const [workMeta, setWorkMeta] = useState<Partial<IPprData>>({});

  const openAddWorkModal = useCallback((nearWorkMeta?: Partial<IPprData>) => {
    if (nearWorkMeta) {
      setWorkMeta(nearWorkMeta);
    } else {
      setWorkMeta({});
    }
    setIsOpenAddWorkModal(true);
  }, []);

  const closeAddWorkModal = useCallback(() => {
    setWorkMeta({});
    setIsOpenAddWorkModal(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        workMeta,
        isOpenAddWorkModal,
        closeAddWorkModal,
        openAddWorkModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useWorkModal = () => useContext(ModalContext);
