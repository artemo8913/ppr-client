"use server";
import { revalidateTag } from "next/cache";
import { IPpr } from ".";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/ppr";

export async function getPprTable(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, { next: { tags: [`ppr-${id}`] } });
  const responce: Promise<IPpr> = query.json();
  return responce;
}
export async function addPprTable(params: Omit<IPpr, "id">) {
  const query = await fetch(`${PPR_API_URL}`, {
    method: "POST",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  revalidateTag(`pprs_info`);
  const responce: Promise<IPpr> = await query.json();
  return responce;
}
export async function updatePprTable(id: string, params: Partial<Omit<IPpr, "id">>) {
  const query = await fetch(`${PPR_API_URL}/${id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  revalidateTag(`ppr-${id}`);
  revalidateTag(`pprs_info`);
  const responce: Promise<IPpr> = await query.json();
  return responce;
}
export async function deletePprTable(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, { method: "DELETE", cache: "no-cache" });
  revalidateTag(`ppr-${id}`);
  revalidateTag(`pprs_info`);
  return JSON.parse(JSON.stringify(query));
}
