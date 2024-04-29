import { authOptions } from "@/1shared/auth/authConfig";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
