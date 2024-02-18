import { IUser } from "@/2entities/User";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: string
    user: IUser
  }
  interface User{
    id: number
  }

}
