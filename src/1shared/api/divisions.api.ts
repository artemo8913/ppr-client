import { eq } from "drizzle-orm";

import { db, directionsTable, distancesTable, subdivisionsTable } from "../database";

interface IDivisionsIds {
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
}

export async function getDivisions({ idDirection, idDistance, idSubdivision }: IDivisionsIds) {
  const directionReq =
    (idDirection && db.query.directionsTable.findFirst({ where: eq(directionsTable.id, idDirection) })) || null;
  const distanceReq =
    (idDistance && db.query.distancesTable.findFirst({ where: eq(distancesTable.id, idDistance) })) || null;
  const subdivisionReq =
    (idSubdivision && db.query.subdivisionsTable.findFirst({ where: eq(subdivisionsTable.id, idSubdivision) })) || null;

  const [direction, distance, subdivision] = await Promise.all([directionReq, distanceReq, subdivisionReq]);

  return { direction, distance, subdivision };
}
