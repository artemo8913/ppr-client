"use server";
import { and, eq, SQL } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/1shared/database";

import { Direction, Distance, Subdivision } from "./division.type";
import { directionsTable, distancesTable, subdivisionsTable } from "./division.schema";

export async function getSubdivisionById(id: number) {
  return db.query.subdivisionsTable.findFirst({ where: eq(subdivisionsTable.id, id) });
}

export async function getDistanceById(id: number) {
  return db.query.distancesTable.findFirst({ where: eq(distancesTable.id, id) });
}

export async function getDirectionById(id: number) {
  return db.query.directionsTable.findFirst({ where: eq(directionsTable.id, id) });
}

async function getAllSubdivisions(idDistance?: number) {
  const filters: SQL[] = [];

  if (idDistance) {
    filters.push(eq(subdivisionsTable.idDistance, idDistance));
  }

  return db
    .select()
    .from(subdivisionsTable)
    .where(and(...filters));
}

async function getAllDistances(idDirection?: number) {
  const filters: SQL[] = [];

  if (idDirection) {
    filters.push(eq(distancesTable.idDirection, idDirection));
  }

  return db
    .select()
    .from(distancesTable)
    .where(and(...filters));
}

async function getAllDirections() {
  return db.select().from(directionsTable);
}

const getAllDivisions = unstable_cache(
  async () => {
    const [subdivisions, distances, directions] = await Promise.all([
      getAllSubdivisions(),
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
  const { directions, distances, subdivisions } = await getAllDivisions();

  const subdivisionsMap = new Map<number, Subdivision>(subdivisions.map((division) => [division.id, division]));
  const distancesMap = new Map<number, Distance>(distances.map((division) => [division.id, division]));
  const directionsMap = new Map<number, Direction>(directions.map((division) => [division.id, division]));

  return { subdivisionsMap, distancesMap, directionsMap, directions, distances, subdivisions };
}
