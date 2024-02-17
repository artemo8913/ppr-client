import { ILoginData } from "../model/loginSchema";

const USER_API_URL = process.env.NEXT_PUBLIC_API_DEV + "/users";

export const userService = {
  async getUserData() {
    const query = await fetch(`${USER_API_URL}`);
    const responce: Promise<ILoginData[]> = query.json();
    return responce;
  },
};
