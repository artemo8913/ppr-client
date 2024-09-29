"use server";
import { eq } from "drizzle-orm";

import { db } from "@/1shared/database";
import { usersTable } from "@/1shared/database/user.schema";

import { IUser } from "..";

export async function getUserData(id: number): Promise<IUser> {
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });

  if (!user) {
    throw new Error(`User with id: ${id} not exist`);
  }

  return user;
}
