import { TPlanWorkPeriodsFields, TTransfer } from "@/2entities/ppr";

export function createNewTransferInstance(fieldTo: keyof TPlanWorkPeriodsFields, value?: number): TTransfer {
  return { fieldTo, value: value || 0 };
}
