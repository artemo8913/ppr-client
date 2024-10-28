"use server";
import { and, eq, SQL } from "drizzle-orm";

import { db, directionsTable, distancesTable, subdivisionsTable } from "@/1shared/database";

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

export async function getSubdivisionById(id: number) {
  return db.query.subdivisionsTable.findFirst({ where: eq(subdivisionsTable.id, id) });
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

export async function getDistanceById(id: number) {
  return db.query.distancesTable.findFirst({ where: eq(distancesTable.id, id) });
}

export async function getAllDirections() {
  return db.select().from(directionsTable);
}

export async function getDirectionById(id: number) {
  return db.query.directionsTable.findFirst({ where: eq(directionsTable.id, id) });
}
