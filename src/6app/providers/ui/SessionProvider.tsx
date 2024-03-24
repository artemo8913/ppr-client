"use client";
import { FC, ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface ISessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: FC<ISessionProviderProps> = ({ children }) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};
