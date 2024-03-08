"use server";
import { addPprInfo } from "@/1shared/api/pprInfo";
import { IAddPprInfoRequest } from "@/1shared/api/pprInfo";
import { addPprTable } from "@/1shared/api/pprTable";
import { deletePprInfo } from "@/1shared/api/pprInfo";
import { deletePprTable } from "@/1shared/api/pprTable";

export async function createPpr(newPprInfo: IAddPprInfoRequest) {
  const result = await addPprInfo(newPprInfo);
  const newPpr = await addPprTable(result.id);
}
export async function deletePpr(id: string) {
  await deletePprInfo(id);
  await deletePprTable(id);
}
