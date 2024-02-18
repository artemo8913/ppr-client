import { ILoginData } from "../model/login.schema";

const LOGIN_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/login";

export const loginService = {
  async getAllLoginsData() {
    const query = await fetch(`${LOGIN_API_URL}`);
    const responce: Promise<ILoginData[]> = query.json();
    return responce;
  },
};
