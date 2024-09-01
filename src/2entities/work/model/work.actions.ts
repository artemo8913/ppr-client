"use server";
import { API_WORK, URL_BASIC } from "@/1shared/const/url";
import { IWork } from "..";

const PPR_API_URL = URL_BASIC + API_WORK;

export async function getAllWorks() {
  const query = await fetch(`${PPR_API_URL}`, { next: { tags: ["work"] } });
  const responce: Promise<IWork[]> = query.json();
  return responce;
}

export async function getWorkById(id: string) {
  const query = await fetch(`${PPR_API_URL}/${id}`);
  const responce: Promise<IWork> = query.json();
  return responce;
}
