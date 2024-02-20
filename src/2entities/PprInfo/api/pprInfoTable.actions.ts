"use server";
import { IAddPprInfoRequest, IPprInfo } from "../model/pprInfo.shema";
import { revalidateTag } from "next/cache";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/all_pprs";

export async function getPprsInfo() {
  const query = await fetch(`${PPR_API_URL}`, { next: { tags: ["pprs_info"] } });
  const responce: Promise<IPprInfo[]> = query.json();
  return responce;
}
export async function addPprInfo(params: IAddPprInfoRequest) {
  const query = await fetch(`${PPR_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const responce: Promise<IPprInfo> = await query.json();
  revalidateTag("pprs_info");
  return responce;
}
export async function deletePprInfo(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, {
    method: "DELETE",
  });
  revalidateTag("pprs_info");
  return query;
}
