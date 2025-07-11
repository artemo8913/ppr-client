import { Month } from "@/1shared/lib/date";
import {
  FactTimeField,
  FactValueField,
  PlannedWorkBasicData,
  PlannedWorkWithCorrections,
  PlannedWorkingMans,
  PlannedWorkId,
  PlanNormTimeField,
  PlanTabelTimeField,
  PlanValueField,
  PlannedWorkingManId,
  WorkTransfer,
} from "./ppr.types";

class YearPlan {
  addWork(newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) {}
  copyWork(id: PlannedWorkId) {}
  deleteWork(id: PlannedWorkId) {}
  editWork(workData: Partial<PlannedWorkBasicData>) {}
  updateNormOfTime(id: PlannedWorkId, value: number) {}
  updatePlanWork(id: PlannedWorkId, field: PlanValueField, value: number) {}
  _updateFactWork(id: PlannedWorkId, field: FactValueField, value: number) {}
  _updateFactWorkTime(id: PlannedWorkId, field: FactTimeField, value: number) {}
  copyFactNormTimeToFactTime(mode: "EVERY" | "NOT_FILLED", month: Month) {}
  updatePprData(id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string | number) {}
  _updatePlanWorkValueByUser(id: PlannedWorkId, field: PlanValueField, newValue: number) {}
  updatePprTableCell(id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string, isWorkAproved?: boolean) {}
  updateTransfers(
    id: PlannedWorkId,
    field: PlanValueField,
    newTransfers: WorkTransfer[] | null,
    type: "plan" | "undone"
  ) {}
  setOneUnityInAllWorks(unity: string) {}
  increaseWorkPosition(id: PlannedWorkId) {}
  decreaseWorkPosition(id: PlannedWorkId) {}
  updateSubbranch(newSubbranch: string, workIdsSet: Set<PlannedWorkId>) {}
  addWorkingMan(nearWorkingManId?: PlannedWorkingManId) {}
  deleteWorkingMan(id: PlannedWorkingManId) {}
  updateWorkingMan(rowIndex: number, field: keyof PlannedWorkingMans, value: unknown) {}
  updateWorkingManPlanNormTime(rowIndex: number, field: PlanNormTimeField, value: number) {}
  updateWorkingManPlanTabelTime(rowIndex: number, field: PlanTabelTimeField, value: number) {}
  updateWorkingManFactTime(rowIndex: number, field: FactTimeField, value: number) {}
  updateWorkingManParticipation(rowIndex: number, value: number) {}
  updateRaportNote(note: string, month: Month) {}
}
