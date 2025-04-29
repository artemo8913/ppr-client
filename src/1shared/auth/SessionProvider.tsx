"use client";
import { FC, ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  return <NextAuthSessionProvider basePath="/api/auth">{children}</NextAuthSessionProvider>;
};
