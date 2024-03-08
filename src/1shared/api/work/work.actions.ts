"use server";
import { IWork } from ".";

const PPR_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/work";

export async function getAllWorks() {
  const query = await fetch(`${PPR_API_URL}`, { next: { tags: ["work"] } });
  const responce: Promise<IWork[]> = query.json();
  return responce;
}

export async function getWorkById(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`);
  const responce: Promise<IWork[]> = query.json();
  return responce;
}
