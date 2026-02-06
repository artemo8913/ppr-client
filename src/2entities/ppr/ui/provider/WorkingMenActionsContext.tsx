"use client";
import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";

import {
  PlannedWorkingMans,
  PlannedWorkingManId,
  PlanNormTimeField,
  PlanTabelTimeField,
  FactTimeField,
} from "../../model/ppr.types";
import { WorkingMenService } from "../../lib/services/WorkingMenService";
import { usePprData } from "./PprDataContext";

export interface IWorkingMenActionsContext {
  addWorkingMan: (nearWorkingManId?: PlannedWorkingManId) => void;
  deleteWorkingMan: (id: PlannedWorkingManId) => void;
  updateWorkingMan: (rowIndex: number, field: keyof PlannedWorkingMans, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: PlanNormTimeField, value: number) => void;
  updateWorkingManPlanTabelTime: (
    rowIndex: number,
    field: PlanTabelTimeField,
    value: number
  ) => void;
  updateWorkingManFactTime: (rowIndex: number, field: FactTimeField, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
}

const WorkingMenActionsContext = createContext<IWorkingMenActionsContext>({
  addWorkingMan: () => {},
  deleteWorkingMan: () => {},
  updateWorkingMan: () => {},
  updateWorkingManPlanNormTime: () => {},
  updateWorkingManPlanTabelTime: () => {},
  updateWorkingManFactTime: () => {},
  updateWorkingManParticipation: () => {},
});

export const useWorkingMenActions = () => {
  const context = useContext(WorkingMenActionsContext);
  if (!context) {
    throw new Error("useWorkingMenActions must be used within WorkingMenActionsProvider");
  }
  return context;
};

export const WorkingMenActionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setPpr } = usePprData();

  const addWorkingMan = useCallback(
    (nearWorkingManId?: PlannedWorkingManId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.addWorkingMan(prev.workingMans, nearWorkingManId),
        };
      });
    },
    [setPpr]
  );

  const deleteWorkingMan = useCallback(
    (id: PlannedWorkingManId) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.deleteWorkingMan(prev.workingMans, id),
        };
      });
    },
    [setPpr]
  );

  const updateWorkingMan = useCallback(
    (rowIndex: number, field: keyof PlannedWorkingMans, value: unknown) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.updateWorkingMan(prev.workingMans, rowIndex, field, value),
        };
      });
    },
    [setPpr]
  );

  const updateWorkingManPlanNormTime = useCallback(
    (rowIndex: number, field: PlanNormTimeField, value: number) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.updateWorkingManPlanNormTime(
            prev.workingMans,
            rowIndex,
            field,
            value
          ),
        };
      });
    },
    [setPpr]
  );

  const updateWorkingManPlanTabelTime = useCallback(
    (rowIndex: number, field: PlanTabelTimeField, value: number) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.updateWorkingManPlanTabelTime(
            prev.workingMans,
            rowIndex,
            field,
            value
          ),
        };
      });
    },
    [setPpr]
  );

  const updateWorkingManFactTime = useCallback(
    (rowIndex: number, field: FactTimeField, value: number) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.updateWorkingManFactTime(
            prev.workingMans,
            rowIndex,
            field,
            value
          ),
        };
      });
    },
    [setPpr]
  );

  const updateWorkingManParticipation = useCallback(
    (rowIndex: number, value: number) => {
      setPpr((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          workingMans: WorkingMenService.updateWorkingManParticipation(
            prev.workingMans,
            rowIndex,
            value
          ),
        };
      });
    },
    [setPpr]
  );

  return (
    <WorkingMenActionsContext.Provider
      value={{
        addWorkingMan,
        deleteWorkingMan,
        updateWorkingMan,
        updateWorkingManPlanNormTime,
        updateWorkingManPlanTabelTime,
        updateWorkingManFactTime,
        updateWorkingManParticipation,
      }}
    >
      {children}
    </WorkingMenActionsContext.Provider>
  );
};
