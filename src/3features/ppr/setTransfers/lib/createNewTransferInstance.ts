import { TPlanWorkPeriods, TTransfer } from "@/2entities/ppr";

export function createNewTransferInstance(fieldTo: TPlanWorkPeriods, value?: number): TTransfer {
  return { fieldTo, value: value || 0 };
}
