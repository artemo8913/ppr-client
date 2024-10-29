import { eq } from "drizzle-orm";

import { db, directionsTable, distancesTable, subdivisionsTable } from "../database";

interface IDivisionsIds {
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
}

export async function getDivisionsById({ idDirection, idDistance, idSubdivision }: IDivisionsIds) {
  try {
    const directionReq =
      (idDirection && db.query.directionsTable.findFirst({ where: eq(directionsTable.id, idDirection) })) || null;
    const distanceReq =
      (idDistance && db.query.distancesTable.findFirst({ where: eq(distancesTable.id, idDistance) })) || null;
    const subdivisionReq =
      (idSubdivision && db.query.subdivisionsTable.findFirst({ where: eq(subdivisionsTable.id, idSubdivision) })) ||
      null;

    const [direction, distance, subdivision] = await Promise.all([directionReq, distanceReq, subdivisionReq]).catch(
      (e) => {
        throw new Error(e);
      }
    );

    return { direction, distance, subdivision };
  } catch (e) {
    throw new Error(`Load divisions by id error. ${e}`);
  }
}
