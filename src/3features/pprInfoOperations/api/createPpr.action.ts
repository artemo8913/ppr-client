"use server";
import { addPprInfo } from "@/2entities/pprInfo";
import { IAddPprInfoRequest } from "@/2entities/pprInfo";
import { addPprTable } from "@/2entities/pprTable";

export async function createPpr(newPprInfo: IAddPprInfoRequest) {
  const result = await addPprInfo(newPprInfo);
  const newPpr = await addPprTable(result.id);
}
