"use server";
import { deletePprInfo } from "@/2entities/pprInfo";
import { deletePprTable } from "@/2entities/pprTable";

export async function deletePpr(id: string) {
  await deletePprInfo(id);
  await deletePprTable(id);
}
