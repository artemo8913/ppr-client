import { getUserData } from "@/2entities/user";
import { getAllLoginsData } from "@/2entities/login";
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
      const user = await getUserData(String(id));
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
        const allLogins = await getAllLoginsData();
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
