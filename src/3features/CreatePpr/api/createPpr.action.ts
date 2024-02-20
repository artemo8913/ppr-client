"use server";
import { addPprInfo } from "@/2entities/PprInfo";
import { IAddPprInfoRequest } from "@/2entities/PprInfo";
import { addPprTable } from "@/2entities/PprTable";

export async function createPpr(newPprInfo: IAddPprInfoRequest) {
  const result = await addPprInfo(newPprInfo);
  const newPpr = await addPprTable(result.id);
}
