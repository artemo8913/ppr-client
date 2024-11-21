"use server";
import { and, eq, like, SQL } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { ROUTE_PPR } from "@/1shared/const/routes";
import { authOptions } from "@/1shared/auth/authConfig";
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
import { getDivisionsById } from "@/1shared/api/divisions.api";
import {
  IPpr,
  TFactNormTimePeriodsFields,
  TFactTimePeriodsFields,
  TFactWorkPeriodsFields,
  TPlanNormTimePeriodsFields,
  TPlanTabelTimePeriodsFields,
  TPlanTimePeriodsFields,
  TPlanWorkPeriodsFields,
  TPprShortInfo,
  TWorkPlanTimePeriodsFields,
  TYearPprStatus,
} from "..";
import { TIME_PERIODS } from "@/1shared/const/date";

import { getPprFieldsByTimePeriod } from "../lib/constFields";

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

    const { direction, distance, subdivision } = await getDivisionsById(pprInfo[0]);

    return {
      ...pprInfo[0],
      created_by: user,
      workingMans: workingMans,
      months_statuses: pprMonthStatuses[0],
      data: pprData,
      directionShortName: direction?.shortName,
      distanceShortName: distance?.shortName,
      subdivisionShortName: subdivision?.shortName,
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

    const isSubdivision = session.user.role === "subdivision";

    const status: TYearPprStatus = isSubdivision ? "plan_creating" : "template";

    const newPprId = await db
      .insert(pprsInfoTable)
      .values({
        name,
        year,
        status,
        created_at: new Date(),
        idUserCreatedBy: session.user.id,
        idDirection: session.user.idDirection,
        idDistance: session.user.idDistance,
        idSubdivision: session.user.idSubdivision,
      })
      .$returningId();

    await db.insert(pprMonthsStatusesTable).values({ idPpr: newPprId[0].id });
  } catch (e) {
    throw new Error(`Create ppr ${name} ${year}. ${e}`);
  }
  revalidatePath(ROUTE_PPR);
}

export async function copyPprTable(params: {
  instancePprId: number;
  name: string;
  year: number;
  isCopyPlanWork?: boolean;
  isCopyFactWork?: boolean;
  isCopyPlanWorkingMans?: boolean;
  isCopyFactWorkingMans?: boolean;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(`Session not exist`);
    }

    const isSubdivision = session.user.role === "subdivision";

    const status: TYearPprStatus = isSubdivision ? "plan_creating" : "template";

    await db.transaction(async (tx) => {
      const newPprId = (
        await tx
          .insert(pprsInfoTable)
          .values({
            name: params.name,
            year: params.year,
            status,
            created_at: new Date(),
            idUserCreatedBy: session.user.id,
            idDirection: session.user.idDirection,
            idDistance: session.user.idDistance,
            idSubdivision: session.user.idSubdivision,
          })
          .$returningId()
      )[0].id;

      const instancePprWorkData = await tx.query.pprsWorkDataTable.findMany({
        where: eq(pprsWorkDataTable.idPpr, params.instancePprId),
      });

      if (instancePprWorkData.length) {
        await tx.insert(pprsWorkDataTable).values(
          instancePprWorkData.map((pprData) => {
            const planWork: Partial<TPlanWorkPeriodsFields> = {};
            const planTime: Partial<TWorkPlanTimePeriodsFields> = {};
            const factWork: Partial<TFactWorkPeriodsFields> = {};
            const factNormTime: Partial<TFactNormTimePeriodsFields> = {};
            const factTime: Partial<TFactTimePeriodsFields> = {};

            TIME_PERIODS.forEach((period) => {
              const { planWorkField, planTimeField, factWorkField, factNormTimeField, factTimeField } =
                getPprFieldsByTimePeriod(period);

              planWork[planWorkField] = {
                original: params.isCopyPlanWork ? pprData[planWorkField].final : 0,
                handCorrection: null,
                planTransfers: null,
                planTransfersSum: 0,
                undoneTransfers: null,
                undoneTransfersSum: 0,
                outsideCorrectionsSum: 0,
                final: params.isCopyPlanWork ? pprData[planWorkField].final : 0,
              };

              planTime[planTimeField] = {
                original: params.isCopyPlanWork ? pprData[planTimeField].final : 0,
                final: params.isCopyPlanWork ? pprData[planTimeField].final : 0,
              };

              factWork[factWorkField] = params.isCopyFactWork ? pprData[factWorkField] : 0;
              factNormTime[factNormTimeField] = params.isCopyFactWork ? pprData[factNormTimeField] : 0;
              factTime[factTimeField] = params.isCopyFactWork ? pprData[factTimeField] : 0;
            });

            return {
              ...pprData,
              idPpr: newPprId,
              id: undefined,
              is_work_aproved: false,
              ...planWork,
              ...planTime,
              ...factWork,
              ...factNormTime,
              ...factTime,
            };
          })
        );
      }

      const instancePprWorkingManData = await tx.query.pprWorkingMansTable.findMany({
        where: eq(pprWorkingMansTable.idPpr, params.instancePprId),
      });

      if (instancePprWorkingManData.length) {
        await tx.insert(pprWorkingMansTable).values(
          instancePprWorkingManData.map((workingMan) => {
            const planNormTime: Partial<TPlanNormTimePeriodsFields> = {};
            const planTabelTime: Partial<TPlanTabelTimePeriodsFields> = {};
            const planTime: Partial<TPlanTimePeriodsFields> = {};
            const factTime: Partial<TFactTimePeriodsFields> = {};

            TIME_PERIODS.forEach((period) => {
              const { planTimeField, planNormTimeField, planTabelTimeField, factTimeField } =
                getPprFieldsByTimePeriod(period);

              planNormTime[planNormTimeField] = params.isCopyPlanWorkingMans ? workingMan[planNormTimeField] : 0;
              planTabelTime[planTabelTimeField] = params.isCopyPlanWorkingMans ? workingMan[planTabelTimeField] : 0;
              planTime[planTimeField] = params.isCopyPlanWorkingMans ? workingMan[planTimeField] : 0;
              factTime[factTimeField] = params.isCopyPlanWorkingMans ? workingMan[factTimeField] : 0;
            });

            return {
              ...workingMan,
              id: undefined,
              idPpr: newPprId,
              ...planNormTime,
              ...planTabelTime,
              ...planTime,
              ...factTime,
            };
          })
        );
      }
      await tx.insert(pprMonthsStatusesTable).values({ idPpr: newPprId });

      revalidatePath(ROUTE_PPR);
    });
  } catch (e) {
    throw new Error(`Create ppr ${params.name} ${params.year} form ppr id = ${params.instancePprId}. ${e}`);
  }
}

export async function updatePprTable(id: number, params: Partial<Omit<IPpr, "id">>) {
  try {
    await db.transaction(async (tx) => {
      params.status && (await tx.update(pprsInfoTable).set({ status: params.status }).where(eq(pprsInfoTable.id, id)));

      params.months_statuses &&
        (await tx
          .update(pprMonthsStatusesTable)
          .set({ ...params.months_statuses })
          .where(eq(pprMonthsStatusesTable.idPpr, id)));

      if (params.workingMans) {
        await tx.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id));

        if (params.workingMans.length) {
          await tx.insert(pprWorkingMansTable).values(
            params.workingMans.map((workingMan) => {
              if (typeof workingMan.id === "string") {
                return { ...workingMan, id: undefined, idPpr: id };
              }
              return { ...workingMan, id: workingMan.id, idPpr: id };
            })
          );
        }
      }

      if (params.data) {
        await tx.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id));

        if (params.data.length) {
          await tx.insert(pprsWorkDataTable).values(
            params.data.map((pprData, index) => {
              if (typeof pprData.id === "string") {
                return { ...pprData, id: undefined, idPpr: id, order: index };
              }
              return { ...pprData, id: pprData.id, idPpr: id, order: index };
            })
          );
        }
      }
    });
  } catch (e) {
    throw new Error(`${e}`);
  }
  revalidatePath(`${ROUTE_PPR}/${id}`);
}

export async function deletePprTable(id: number) {
  try {
    await db.transaction(async (tx) => {
      await Promise.all([
        tx.delete(pprMonthsStatusesTable).where(eq(pprMonthsStatusesTable.idPpr, id)),
        tx.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id)),
        tx.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id)),
        tx.delete(pprsInfoTable).where(eq(pprsInfoTable.id, id)),
      ]).catch((e) => {
        throw new Error(e);
      });
    });
  } catch (e) {
    throw new Error(`Delete ppr ${id}. ${e}`);
  }
  revalidatePath(ROUTE_PPR);
}

export async function getManyPprsShortInfo(params?: {
  name?: string;
  year?: number | string;
  idDirection?: number | string;
  idDistance?: number | string;
  idSubdivision?: number | string;
}): Promise<TPprShortInfo[]> {
  const filters: SQL[] = [];

  if (params?.name) filters.push(like(pprsInfoTable.name, `%${params.name}%`));
  if (params?.year) filters.push(eq(pprsInfoTable.year, Number(params.year)));
  if (params?.idDirection) filters.push(eq(pprsInfoTable.idDirection, Number(params.idDirection)));
  if (params?.idDistance) filters.push(eq(pprsInfoTable.idDistance, Number(params.idDistance)));
  if (params?.idSubdivision) filters.push(eq(pprsInfoTable.idSubdivision, Number(params.idSubdivision)));

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
        idDirection: pprsInfoTable.idDirection,
        idDistance: pprsInfoTable.idDistance,
        idSubdivision: pprsInfoTable.idSubdivision,
        directionShortName: directionsTable.shortName,
        distanceShortName: distancesTable.shortName,
        subdivisionShortName: subdivisionsTable.shortName,
      })
      .from(pprsInfoTable)
      .where(and(...filters))
      .innerJoin(usersTable, eq(pprsInfoTable.idUserCreatedBy, usersTable.id))
      .innerJoin(pprMonthsStatusesTable, eq(pprsInfoTable.id, pprMonthsStatusesTable.idPpr))
      .leftJoin(directionsTable, eq(pprsInfoTable.idDirection, directionsTable.id))
      .leftJoin(distancesTable, eq(pprsInfoTable.idDistance, distancesTable.id))
      .leftJoin(subdivisionsTable, eq(pprsInfoTable.idSubdivision, subdivisionsTable.id));

    return responce;
  } catch (e) {
    throw new Error(`Get all pprs. ${e}`);
  }
}
