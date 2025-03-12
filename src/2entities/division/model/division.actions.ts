"use server";
import { and, eq, SQL } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/1shared/database";

import {
  directionsTable,
  distancesTable,
  subdivisionsTable,
  TDirectionDB,
  TDistanceDB,
  TSubdivisionDB,
} from "./division.schema";

export async function getAllSubdivision(idDistance?: number) {
  const filters: SQL[] = [];

  if (idDistance) {
    filters.push(eq(subdivisionsTable.idDistance, idDistance));
  }

  return db
    .select()
    .from(subdivisionsTable)
    .where(and(...filters));
}

export async function getAllDistances(idDirection?: number) {
  const filters: SQL[] = [];

  if (idDirection) {
    filters.push(eq(distancesTable.idDirection, idDirection));
  }

  return db
    .select()
    .from(distancesTable)
    .where(and(...filters));
}

export async function getAllDirections() {
  return db.select().from(directionsTable);
}

export const getDivisions = unstable_cache(
  async () => {
    const [subdivisions, distances, directions] = await Promise.all([
      getAllSubdivision(),
      getAllDistances(),
      getAllDirections(),
    ]).catch((e) => {
      throw new Error(`Load divisions data for ppr info page error. ${e}`);
    });

    return { subdivisions, distances, directions };
  },
  ["divisions"],
  { revalidate: 3600, tags: ["divisions"] }
);

export async function getDivisionsMap() {
  const { directions, distances, subdivisions } = await getDivisions();

  const subdivisionsMap = new Map<number, TSubdivisionDB>();
  const distancesMap = new Map<number, TDistanceDB>();
  const directionsMap = new Map<number, TDirectionDB>();

  subdivisions.forEach((division) => {
    subdivisionsMap.set(division.id, division);
  });

  distances.forEach((division) => {
    distancesMap.set(division.id, division);
  });

  directions.forEach((division) => {
    directionsMap.set(division.id, division);
  });

  return { subdivisionsMap, distancesMap, directionsMap, directions, distances, subdivisions };
}

interface IDivisionsIds {
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
}

export interface IGetDivisionsResponce {
  direction?: TDirectionDB | null;
  distance?: TDistanceDB | null;
  subdivision?: TSubdivisionDB | null;
}

export async function getDivisionsById({
  idDirection,
  idDistance,
  idSubdivision,
}: IDivisionsIds): Promise<IGetDivisionsResponce> {
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
