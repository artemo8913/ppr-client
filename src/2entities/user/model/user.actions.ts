"use server";
import { API_USER, URL_BASIC } from "@/1shared/const/url";
import { IUser } from "..";

const USER_API_URL = URL_BASIC + API_USER;

export async function getUserData(id: string) {
  const query = await fetch(`${USER_API_URL}/${id}`);
  const responce: Promise<IUser> = query.json();
  return responce;
}
