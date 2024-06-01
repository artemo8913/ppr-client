import { IPlanWorkPeriods } from "@/2entities/ppr";

export function createNewTransferInstance(fieldTo: keyof IPlanWorkPeriods, value?: number) {
  return { fieldTo, is_approved: false, value: value || 0 };
}
