import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getCredential } from "@/2entities/login";
import { getUserData } from "@/2entities/user";

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
      const user = await getUserData(Number(id));
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
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const response = await getCredential(credentials.username);

        const isPasswordCorrect = response.password === credentials.password;

        if (isPasswordCorrect) {
          return {
            id: response.id,
            username: response.username,
          };
        }

        return null;
      },
    }),
  ],
};
