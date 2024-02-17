import { userService } from "@/3features/Login/api/user.service";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const allUsers = await userService.getUserData();
        const user = allUsers.find((user) => user.username === credentials?.username);
        const isPasswordCorrect = user?.password === credentials?.password;
        if (isPasswordCorrect) {
          return {
            id: String(user?.id),
            username: user?.username,
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
