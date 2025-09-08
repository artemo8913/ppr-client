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
  YearPlan,
} from "../ppr.types";

export class YearPlanStore {
  private _plan: YearPlan;

  constructor(yearPlan: YearPlan) {
    this._plan = yearPlan;
  }

  private _updateNormOfTime(id: PlannedWorkId, value: number) {}
  private _updatePlanWork(id: PlannedWorkId, field: PlanValueField, value: number) {}
  private _updateFactWork(id: PlannedWorkId, field: FactValueField, value: number) {}
  private _updateFactWorkTime(id: PlannedWorkId, field: FactTimeField, value: number) {}
  private _updatePlanWorkValueByUser(id: PlannedWorkId, field: PlanValueField, newValue: number) {}
  private _updatePprData(id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string | number) {}

  addWork(newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) {}

  copyWork(id: PlannedWorkId) {}

  deleteWork(id: PlannedWorkId) {
    this._plan.data = this._plan.data.filter((work) => work.id !== id);
  }

  editWork(workData: Partial<PlannedWorkBasicData>) {}
  copyFactNormTimeToFactTime(mode: "EVERY" | "NOT_FILLED", month: Month) {}
  updatePprTableCell(id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string) {}
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
