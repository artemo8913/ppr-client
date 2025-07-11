import { Month } from "@/1shared/lib/date";
import {
  FactTimeField,
  FactWorkValueField,
  IPprBasicData,
  IPprData,
  IWorkingManYearPlan,
  PlannedWorkId,
  PlanNormTimeField,
  PlanTabelTimeField,
  PlanWorkValueField,
  TWorkingManId,
  WorkTransfer,
} from "./ppr.types";

class YearPlan {
  addWork(newWork: Partial<IPprData>, nearWorkId?: PlannedWorkId) {}
  copyWork(id: PlannedWorkId) {}
  deleteWork(id: PlannedWorkId) {}
  editWork(workData: Partial<IPprBasicData>) {}
  updateNormOfTime(id: PlannedWorkId, value: number) {}
  updatePlanWork(id: PlannedWorkId, field: PlanWorkValueField, value: number) {}
  _updateFactWork(id: PlannedWorkId, field: FactWorkValueField, value: number) {}
  _updateFactWorkTime(id: PlannedWorkId, field: FactTimeField, value: number) {}
  copyFactNormTimeToFactTime(mode: "EVERY" | "NOT_FILLED", month: Month) {}
  updatePprData(id: PlannedWorkId, field: keyof IPprData, value: string | number) {}
  _updatePlanWorkValueByUser(id: PlannedWorkId, field: PlanWorkValueField, newValue: number) {}
  updatePprTableCell(id: PlannedWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) {}
  updateTransfers(
    id: PlannedWorkId,
    field: PlanWorkValueField,
    newTransfers: WorkTransfer[] | null,
    type: "plan" | "undone"
  ) {}
  setOneUnityInAllWorks(unity: string) {}
  increaseWorkPosition(id: PlannedWorkId) {}
  decreaseWorkPosition(id: PlannedWorkId) {}
  updateSubbranch(newSubbranch: string, workIdsSet: Set<PlannedWorkId>) {}
  addWorkingMan(nearWorkingManId?: TWorkingManId) {}
  deleteWorkingMan(id: TWorkingManId) {}
  updateWorkingMan(rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) {}
  updateWorkingManPlanNormTime(rowIndex: number, field: PlanNormTimeField, value: number) {}
  updateWorkingManPlanTabelTime(rowIndex: number, field: PlanTabelTimeField, value: number) {}
  updateWorkingManFactTime(rowIndex: number, field: FactTimeField, value: number) {}
  updateWorkingManParticipation(rowIndex: number, value: number) {}
  updateRaportNote(note: string, month: Month) {}
}
