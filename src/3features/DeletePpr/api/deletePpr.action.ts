"use server";
import { deletePprInfo } from "@/2entities/PprInfo";
import { deletePprTable } from "@/2entities/PprTable";

export async function deletePpr(id: string) {
  await deletePprInfo(id);
  await deletePprTable(id);
}
