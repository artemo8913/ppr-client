"use server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { ROUTE_PPR } from "@/1shared/const/routes";
import { authOptions } from "@/1shared/auth/authConfig";
import { calculatePprTotalValues } from "@/1shared/providers/pprProvider";
import {
  db,
  directionsTable,
  distancesTable,
  pprMonthsStatusesTable,
  pprsInfoTable,
  pprsWorkDataTable,
  pprWorkingMansTable,
  subdivisionsTable,
  usersTable,
} from "@/1shared/database";

import { IPpr, TPprShortInfo } from "..";

export async function getPprTable(id: number): Promise<IPpr> {
  try {
    const [pprInfo, workingMans, pprMonthStatuses, pprData] = await Promise.all([
      db.select().from(pprsInfoTable).where(eq(pprsInfoTable.id, id)),
      db.select().from(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id)),
      db.select().from(pprMonthsStatusesTable).where(eq(pprMonthsStatusesTable.idPpr, id)),
      db.select().from(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id)).orderBy(pprsWorkDataTable.order),
    ]).catch((e) => {
      throw new Error(e);
    });

    if (pprInfo.length !== 1) {
      throw new Error(`Unique ppr with id ${id} not exist`);
    }

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, pprInfo[0].idUserCreatedBy) });

    if (!user) {
      throw new Error(`User id ${pprInfo[0].idUserCreatedBy} created ppr with id ${id} not exist`);
    }

    const totalFieldsValues = calculatePprTotalValues(pprData, workingMans);

    return {
      ...pprInfo[0],
      created_by: user,
      peoples: workingMans,
      months_statuses: pprMonthStatuses[0],
      data: pprData,
      total_fields_value: totalFieldsValues,
    };
  } catch (e) {
    throw new Error(`Load ppr data. ${e}`);
  }
}

export async function createPprTable(name: string, year: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(`Session not exist`);
    }

    const newPprId = await db
      .insert(pprsInfoTable)
      .values({
        name: name,
        year: year,
        created_at: new Date(),
        status: "plan_creating",
        idUserCreatedBy: session.user.id,
        id_direction: session.user.idDirection,
        id_distance: session.user.idDistance,
        id_subdivision: session.user.idSubdivision,
      })
      .$returningId();

    await db.insert(pprMonthsStatusesTable).values({ idPpr: newPprId[0].id });
  } catch (e) {
    throw new Error(`Create ppr ${name} ${year}. ${e}`);
  }
  revalidatePath(ROUTE_PPR);
}

export async function updatePprTable(id: number, params: Partial<Omit<IPpr, "id">>) {
  try {
    params.status && (await db.update(pprsInfoTable).set({ status: params.status }).where(eq(pprsInfoTable.id, id)));

    params.months_statuses &&
      (await db
        .update(pprMonthsStatusesTable)
        .set({ ...params.months_statuses })
        .where(eq(pprMonthsStatusesTable.idPpr, id)));

    if (params.peoples) {
      await db.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id));
      await db.insert(pprWorkingMansTable).values(
        params.peoples.map((workingMan) => {
          if (typeof workingMan.id === "string") {
            return { ...workingMan, id: undefined, idPpr: id };
          }
          return { ...workingMan, id: workingMan.id, idPpr: id };
        })
      );
    }

    if (params.data) {
      await db.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id));
      await db.insert(pprsWorkDataTable).values(
        params.data.map((pprData, index) => {
          if (typeof pprData.id === "string") {
            return { ...pprData, id: undefined, idPpr: id, order: index };
          }
          return { ...pprData, id: pprData.id, idPpr: id, order: index };
        })
      );
    }
  } catch (e) {
    throw new Error(`${e}`);
  }
  revalidatePath(`${ROUTE_PPR}/${id}`);
}

export async function deletePprTable(id: number) {
  try {
    await Promise.all([
      db.delete(pprMonthsStatusesTable).where(eq(pprMonthsStatusesTable.idPpr, id)),
      db.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id)),
      db.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id)),
    ]).catch((e) => {
      throw new Error(e);
    });
    await db.delete(pprsInfoTable).where(eq(pprsInfoTable.id, id));
  } catch (e) {
    throw new Error(`Delete ppr ${id}. ${e}`);
  }
  revalidatePath(ROUTE_PPR);
}

export async function getManyPprsShortInfo(): Promise<TPprShortInfo[]> {
  try {
    const responce = await db
      .select({
        id: pprsInfoTable.id,
        name: pprsInfoTable.name,
        year: pprsInfoTable.year,
        status: pprsInfoTable.status,
        created_at: pprsInfoTable.created_at,
        created_by: usersTable,
        months_statuses: pprMonthsStatusesTable,
        id_direction: pprsInfoTable.id_direction,
        id_distance: pprsInfoTable.id_distance,
        id_subdivision: pprsInfoTable.id_subdivision,
        directionShortName: directionsTable.shortName,
        distanceShortName: distancesTable.shortName,
        subdivisionShortName: subdivisionsTable.shortName,
      })
      .from(pprsInfoTable)
      .innerJoin(usersTable, eq(pprsInfoTable.idUserCreatedBy, usersTable.id))
      .innerJoin(pprMonthsStatusesTable, eq(pprsInfoTable.id, pprMonthsStatusesTable.idPpr))
      .innerJoin(directionsTable, eq(pprsInfoTable.id_direction, directionsTable.id))
      .innerJoin(distancesTable, eq(pprsInfoTable.id_distance, distancesTable.id))
      .innerJoin(subdivisionsTable, eq(pprsInfoTable.id_subdivision, subdivisionsTable.id));

    return responce;
  } catch (e) {
    throw new Error(`Get all pprs. ${e}`);
  }
}
