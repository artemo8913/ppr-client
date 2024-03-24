"use server";
import { revalidateTag } from "next/cache";
import { IPpr } from ".";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/ppr";

export async function getPprTable(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, { next: { tags: [`ppr-${id}`], revalidate:1 } });
  const responce: Promise<IPpr> = query.json();
  return responce;
}
export async function addPprTable(id: string) {
  const params: IPpr = { created_at: new Date().toString(), data: [], id, status: "plan_creating", monthsStatus:'year' };
  const query = await fetch(`${PPR_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const responce: Promise<IPpr> = await query.json();
  return responce;
}
export async function updatePprTable(id: string, params: Partial<Omit<IPpr, "id">>) {
  const query = await fetch(`${PPR_API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  revalidateTag(`ppr-${id}`);
  const responce: Promise<IPpr> = await query.json();
  return responce;
}
export async function deletePprTable(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, {
    method: "DELETE",
  });
  revalidateTag(`ppr-${id}`);
  return query;
}
