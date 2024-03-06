"use server";
import { addPprInfo } from "@/1shared/api/pprInfo";
import { IAddPprInfoRequest } from "@/1shared/api/pprInfo";
import { addPprTable } from "@/1shared/api/pprTable";

export async function createPpr(newPprInfo: IAddPprInfoRequest) {
  const result = await addPprInfo(newPprInfo);
  const newPpr = await addPprTable(result.id);
}
