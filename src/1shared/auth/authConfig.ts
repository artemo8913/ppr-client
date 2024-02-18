import { userService } from "@/2entities/User";
import { loginService } from "@/3features/Login/api/login.service";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          return { ...token, ...user };
        }
        return token;
      },
      async session({ session, token: { id } }) {
        const user = await userService.getUserData(Number(id));
        if (user) {
          return { expires: session.expires, user: { ...user } };
        }
        return session;
      },
    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          username: { label: "username", type: "text" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const allLogins = await loginService.getAllLoginsData();
          const login = allLogins.find((login) => login.username === credentials?.username);
          const isPasswordCorrect = login?.password === credentials?.password;
          if (isPasswordCorrect && login) {
            return {
              id: login.id,
              username: login.username,
            };
          }
          return null;
        },
      }),
    ],
  };
  