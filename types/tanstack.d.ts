import { IPprData } from "@/2entities/pprTable";
import { IPlanWork } from "@/2entities/pprTable/model/pprTable.schema";
import "@tanstack/react-table";
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updatePprData: (rowIndex: number, columnId: string, value: unknown) => void;
    correctWorkPlan: (fieldName: keyof IPlanWork, objectId: string, newValue: number, oldValue: number) => void;
  }
}
