import { IPlanWorkPeriods } from "@/2entities/pprTable";

export function createNewTransferInstance(fieldTo: keyof IPlanWorkPeriods, value?: number) {
  return { fieldTo, is_approved: false, value: value || 0 };
}
