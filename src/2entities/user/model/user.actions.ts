"use server";
import { eq } from "drizzle-orm";

import { db, usersTable } from "@/1shared/database";
import { getDivisionsById } from "@/1shared/api/divisions.api";

import { IUser } from "./user.types";

export async function getUserData(id: number): Promise<IUser> {
  try {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });

    if (!user) {
      throw new Error(`User with id = ${id} not exist`);
    }

    const { direction, distance, subdivision } = await getDivisionsById(user);

    return {
      ...user,
      directionShortName: direction?.shortName,
      distanceShortName: distance?.shortName,
      subdivisionShortName: subdivision?.shortName,
    };
  } catch (e) {
    throw new Error(`${e}`);
  }
}
