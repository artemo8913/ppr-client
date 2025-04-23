import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { AuthOptions, Session, User } from "next-auth";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";

import { getUser, getCredentials, ICredential } from "@/2entities/user";

type CredentialsLabel = keyof Omit<ICredential, "id">;

const CREDENTIALS_OPTIONS: { [key in CredentialsLabel]: CredentialInput } = {
  username: { label: "username", type: "text" },
  password: { label: "password", type: "password" },
};

async function authorizeByCredential(loginCredentials: Record<CredentialsLabel, string> | undefined) {
  if (!loginCredentials) {
    return null;
  }

  const credentialsFromDB = await getCredentials(loginCredentials.username);

  const isPasswordCorrect = credentialsFromDB.password === loginCredentials.password;

  if (!isPasswordCorrect) {
    return null;
  }

  return {
    id: credentialsFromDB.id,
    username: credentialsFromDB.username,
  };
}

async function createSession({ session, token: { id } }: { session: Session; token: JWT; user: AdapterUser }) {
  const user = await getUser(Number(id));

  return { expires: session.expires, user: { ...user } };
}

async function createJWT({ token, user }: { token: JWT; user: User | AdapterUser }) {
  return { ...token, ...user };
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: createJWT,
    session: createSession,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: CREDENTIALS_OPTIONS,
      authorize: authorizeByCredential,
    }),
  ],
};
