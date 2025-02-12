import NextAuth from "next-auth";

import { IUser } from "@/2entities/user";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: IUser;
  }
  interface User {
    id: number;
  }
}
