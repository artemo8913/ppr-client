"use client";
import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";

import { Month } from "@/1shared/lib/date";

import {
  PlannedWorkWithCorrections,
  PlannedWorkId,
  PlannedWorkBasicData,
  PlanValueField,
  WorkTransfer,
} from "../../model/ppr.types";
import { PprField } from "../../model/service/PprField";
import { WorksService } from "../../lib/services/WorksService";
import { usePprData } from "./PprDataContext";

export interface IWorksActionsContext {
  addWork: (newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) => void;
  copyWork: (id: PlannedWorkId) => void;
  deleteWork: (id: PlannedWorkId) => void;
  editWork: (workData: Partial<PlannedWorkBasicData>) => void;
  updatePprTableCell: (
    id: PlannedWorkId,
    field: keyof PlannedWorkWithCorrections,
    value: string,
    isWorkAproved?: boolean
  ) => void;
  updateTransfers: (
    id: PlannedWorkId,
    field: PlanValueField,
    newTransfers: WorkTransfer[] | null,
    type: "plan" | "undone"
  ) => void;
  copyFactNormTimeToFactTime: (mode: "EVERY" | "NOT_FILLED", month: Month) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  increaseWorkPosition: (id: PlannedWorkId) => void;
  decreaseWorkPosition: (id: PlannedWorkId) => void;
  updateSubbranch: (newSubbranch: string, workIdsSet: Set<PlannedWorkId>) => void;
  updateRaportNote: (note: string, month: Month) => void;
}

const WorksActionsContext = createContext<IWorksActionsContext>({
  addWork: () => {},
  copyWork: () => {},
  deleteWork: () => {},
  editWork: () => {},
  updatePprTableCell: () => {},
  updateTransfers: () => {},
  copyFactNormTimeToFactTime: () => {},
  setOneUnityInAllWorks: () => {},
  increaseWorkPosition: () => {},
  decreaseWorkPosition: () => {},
  updateSubbranch: () => {},
  updateRaportNote: () => {},
});

export const useWorksActions = () => {
  const context = useContext(WorksActionsContext);
  if (!context) {
    throw new Error("useWorksActions must be used within WorksActionsProvider");
  }
  return context;
};

export const WorksActionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setPpr } = usePprData();

  const addWork = useCallback(
    (newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.addWork(prev.data, newWork, nearWorkId) };
      });
    },
    [setPpr]
  );

  const copyWork = useCallback(
    (id: PlannedWorkId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.copyWork(prev.data, id) };
      });
    },
    [setPpr]
  );

  const deleteWork = useCallback(
    (id: PlannedWorkId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.deleteWork(prev.data, id) };
      });
    },
    [setPpr]
  );

  const editWork = useCallback(
    (workData: Partial<PlannedWorkBasicData>) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.editWork(prev.data, workData) };
      });
    },
    [setPpr]
  );

  const updatePprTableCell = useCallback(
    (
      id: PlannedWorkId,
      field: keyof PlannedWorkWithCorrections,
      value: string,
      isWorkAproved?: boolean
    ) => {
      setPpr((prev) => {
        if (!prev) return prev;

        let newData: PlannedWorkWithCorrections[];

        if (field === "norm_of_time") {
          newData = WorksService.updateNormOfTime(prev.data, id, Number(value));
        } else if (PprField.isFactWork(field)) {
          newData = WorksService.updateFactWork(prev.data, id, field, Number(value));
        } else if (PprField.isFactTime(field)) {
          newData = WorksService.updateFactWorkTime(prev.data, id, field, Number(value));
        } else if (!isWorkAproved && PprField.isPlanWork(field)) {
          newData = WorksService.updatePlanWork(prev.data, id, field, Number(value));
        } else if (isWorkAproved && PprField.isPlanWork(field)) {
          newData = WorksService.updatePlanWorkValueByUser(prev.data, id, field, Number(value));
        } else {
          newData = WorksService.updatePprData(prev.data, id, field, value);
        }

        return { ...prev, data: newData };
      });
    },
    [setPpr]
  );

  const updateTransfers = useCallback(
    (
      id: PlannedWorkId,
      field: PlanValueField,
      newTransfers: WorkTransfer[] | null,
      type: "plan" | "undone"
    ) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: WorksService.updateTransfers(prev.data, id, field, newTransfers, type),
        };
      });
    },
    [setPpr]
  );

  const copyFactNormTimeToFactTime = useCallback(
    (mode: "EVERY" | "NOT_FILLED", month: Month) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: WorksService.copyFactNormTimeToFactTime(prev.data, mode, month),
        };
      });
    },
    [setPpr]
  );

  const setOneUnityInAllWorks = useCallback(
    (unity: string) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.setOneUnityInAllWorks(prev.data, unity) };
      });
    },
    [setPpr]
  );

  const increaseWorkPosition = useCallback(
    (id: PlannedWorkId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.increaseWorkPosition(prev.data, id) };
      });
    },
    [setPpr]
  );

  const decreaseWorkPosition = useCallback(
    (id: PlannedWorkId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return { ...prev, data: WorksService.decreaseWorkPosition(prev.data, id) };
      });
    },
    [setPpr]
  );

  const updateSubbranch = useCallback(
    (newSubbranch: string, workIdsSet: Set<PlannedWorkId>) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: WorksService.updateSubbranch(prev.data, newSubbranch, workIdsSet),
        };
      });
    },
    [setPpr]
  );

  const updateRaportNote = useCallback(
    (note: string, month: Month) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          raports_notes: {
            ...prev.raports_notes,
            [month]: note,
          },
        };
      });
    },
    [setPpr]
  );

  return (
    <WorksActionsContext.Provider
      value={{
        addWork,
        copyWork,
        deleteWork,
        editWork,
        updatePprTableCell,
        updateTransfers,
        copyFactNormTimeToFactTime,
        setOneUnityInAllWorks,
        increaseWorkPosition,
        decreaseWorkPosition,
        updateSubbranch,
        updateRaportNote,
      }}
    >
      {children}
    </WorksActionsContext.Provider>
  );
};
