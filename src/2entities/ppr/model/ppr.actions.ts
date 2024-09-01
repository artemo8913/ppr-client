"use server";
import { revalidateTag } from "next/cache";

import { API_PPR, URL_BASIC } from "@/1shared/const/url";
import { IPpr } from "..";

const PPR_API_URL = URL_BASIC + API_PPR;

export async function getPprTable(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`, { next: { tags: [`ppr-${id}`] }, cache: "no-cache" });
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

export async function getManyPprsShortInfo() {
  const query = await fetch(`${PPR_API_URL}`, { next: { tags: ["pprs_info"] } });
  const responce: Promise<Omit<IPpr, "data">[]> = query.json();
  return responce;
}
