import NextAuth from "next-auth";

import { User as AppUser } from "@/2entities/user";

declare module "next-auth" {
  interface Session {
    expires: string;
    user: AppUser;
  }
  interface User {
    id: number;
  }
}
