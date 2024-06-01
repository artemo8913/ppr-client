import { IPprData } from "@/2entities/ppr";
import { IPlanWorkPeriods } from "@/2entities/ppr/model/ppr.schema";
import "@tanstack/react-table";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    correctPlan?: (objectId: string, fieldName: keyof IPlanWorkPeriods, newValue: number, oldValue: number) => void;
  }
}
