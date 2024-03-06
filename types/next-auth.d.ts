import { IUser } from "@/1shared/api/user";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: IUser;
  }
  interface User {
    id: string;
  }
}
