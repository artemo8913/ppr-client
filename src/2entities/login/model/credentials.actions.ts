"use server";
import { eq } from "drizzle-orm";

import { db, credentialsTable } from "@/1shared/database";

import { ICredential } from "./credentials.types";

export async function getCredential(username: string): Promise<ICredential> {
  const credential = await db.query.credentialsTable.findFirst({
    where: eq(credentialsTable.username, username),
  });

  if (!credential) {
    throw new Error(`Credentials for ${username} not exist`);
  }

  return credential;
}
