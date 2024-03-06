"use server";
import { deletePprInfo } from "@/1shared/api/pprInfo";
import { deletePprTable } from "@/1shared/api/pprTable";

export async function deletePpr(id: string) {
  await deletePprInfo(id);
  await deletePprTable(id);
}
