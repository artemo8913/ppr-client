"use server";
import { IUser } from "..";

const USER_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/user";

export async function getUserData(id: string) {
  const query = await fetch(`${USER_API_URL}/${id}`);
  const responce: Promise<IUser> = query.json();
  return responce;
}
