"use server";
import { eq } from "drizzle-orm";

import { db } from "@/1shared/database";
import { directionsTable, distancesTable, subdivisionsTable } from "@/2entities/division/@x/user";

import { User, Credential } from "./user.types";
import { credentialsTable, usersTable } from "./user.schema";

export async function getUser(id: number): Promise<User> {
  try {
    const res = (
      await db
        .select()
        .from(usersTable)
        .leftJoin(directionsTable, eq(usersTable.idDirection, directionsTable.id))
        .leftJoin(distancesTable, eq(usersTable.idDistance, distancesTable.id))
        .leftJoin(subdivisionsTable, eq(usersTable.idSubdivision, subdivisionsTable.id))
        .where(eq(usersTable.id, id))
    )[0];

    if (!res.users.id) {
      throw new Error(`User with id = ${id} not exist`);
    }

    return {
      ...res.users,
      directionShortName: res.directions?.shortName,
      distanceShortName: res.distances?.shortName,
      subdivisionShortName: res.subdivisions?.shortName,
    };
  } catch (e) {
    throw new Error(`${e}`);
  }
}

export async function getCredentials(username: string): Promise<Credential> {
  try {
    const credentials = await db.query.credentialsTable.findFirst({
      where: eq(credentialsTable.username, username),
    });

    if (!credentials) {
      throw new Error(`Credentials for ${username} not exist`);
    }

    return credentials;
  } catch (e) {
    throw new Error(`${e}`);
  }
}
