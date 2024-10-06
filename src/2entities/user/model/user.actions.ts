"use server";
import { eq } from "drizzle-orm";

import { db, directionsTable, distancesTable, subdivisionsTable, usersTable } from "@/1shared/database";

import { IUser } from "..";

export async function getUserData(id: number): Promise<IUser> {
  try {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });

    if (!user) {
      throw new Error(`User with id = ${id} not exist`);
    }

    const directionReq =
      (user.idDirection && db.query.directionsTable.findFirst({ where: eq(directionsTable.id, user.idDirection) })) ||
      null;
    const distanceReq =
      (user.idDistance && db.query.distancesTable.findFirst({ where: eq(distancesTable.id, user.idDistance) })) || null;
    const subdivisionReq =
      (user.idSubdivision &&
        db.query.subdivisionsTable.findFirst({ where: eq(subdivisionsTable.id, user.idSubdivision) })) ||
      null;

    const [direction, distance, subdivision] = await Promise.all([directionReq, distanceReq, subdivisionReq]);

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
