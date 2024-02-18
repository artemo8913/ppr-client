"use server";
import { IPpr } from "..";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/ppr";

export async function getPpr(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`);
  const responce: Promise<IPpr> = query.json();
  return responce;
}
