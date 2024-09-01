"use server";
import {URL_BASIC, API_LOGIN} from '@/1shared/const/url';
import { ILoginData } from "./login.schema";

const LOGIN_API_URL = URL_BASIC + API_LOGIN;

export async function getAllLoginsData() {
  const query = await fetch(`${LOGIN_API_URL}`);
  const responce: Promise<ILoginData[]> = query.json();
  return responce;
}
