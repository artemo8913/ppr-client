import { TTransfer } from "@/2entities/ppr";

export function createNewTransferInstance<T>(fieldTo: keyof T, value?: number): TTransfer<T> {
  return { fieldTo, is_approved: false, value: value || 0 };
}
