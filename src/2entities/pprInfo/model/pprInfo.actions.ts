"use server";
import { IPpr } from "../../pprTable";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/all_pprs";

export async function getPprsInfo() {
  const query = await fetch(`${PPR_API_URL}`, { next: { tags: ["pprs_info"] } });
  const responce: Promise<IPpr[]> = query.json();
  return responce;
}
