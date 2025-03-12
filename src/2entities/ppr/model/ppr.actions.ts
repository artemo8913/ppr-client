"use server";
import { and, eq, isNotNull, like, or, SQL } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { db } from "@/1shared/database";
import { ROUTE_PPR } from "@/1shared/lib/routes";
import { authOptions } from "@/1shared/auth/authConfig";
import { MONTHS, TIME_PERIODS } from "@/1shared/lib/date";
import { IServerActionReturn, returnError, returnSuccess } from "@/1shared/serverAction";
import { buildConflictUpdateColumns } from "@/1shared/lib/database/buildConflictUpdateColumns";
import { usersTable } from "@/2entities/user/@x/ppr";
import { directionsTable, distancesTable, subdivisionsTable } from "@/2entities/division/@x/ppr";

import {
  pprMonthsStatusesTable,
  pprRaportsNotesTable,
  pprsInfoTable,
  pprsWorkDataTable,
  pprWorkingMansTable,
} from "./ppr.schema";
import {
  IPpr,
  IPprData,
  TFactNormTimePeriodsFields,
  TFactTimePeriodsFields,
  TFactWorkPeriodsFields,
  TMonthPprStatus,
  TPlanNormTimePeriodsFields,
  TPlanTabelTimePeriodsFields,
  TPlanTimePeriodsFields,
  TPlanWorkPeriodsFields,
  TPprShortInfo,
  TWorkPlanTimePeriodsFields,
  TYearPprStatus,
} from "./ppr.types";
import {
  getPprFieldsByTimePeriod,
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
  PLAN_WORK_FIELDS,
  PPR_DATA_BASIC_FIELDS,
} from "./ppr.const";

export async function getPprTable(id: number): Promise<IServerActionReturn<IPpr>> {
  try {
    const [pprInfoRes, workingMans, pprMonthStatuses, pprData, raportsNotes] = await Promise.all([
      db
        .select()
        .from(pprsInfoTable)
        .leftJoin(directionsTable, eq(pprsInfoTable.idDirection, directionsTable.id))
        .leftJoin(distancesTable, eq(pprsInfoTable.idDistance, distancesTable.id))
        .leftJoin(subdivisionsTable, eq(pprsInfoTable.idSubdivision, subdivisionsTable.id))
        .where(eq(pprsInfoTable.id, id)),
      db.select().from(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id)),
      db.select().from(pprMonthsStatusesTable).where(eq(pprMonthsStatusesTable.idPpr, id)),
      db.select().from(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id)).orderBy(pprsWorkDataTable.order),
      db.select().from(pprRaportsNotesTable).where(eq(pprRaportsNotesTable.idPpr, id)),
    ]).catch((e) => {
      throw new Error(e);
    });

    if (pprInfoRes.length !== 1) {
      throw new Error(`Unique ppr with id ${id} not exist`);
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, pprInfoRes[0].pprs_info.idUserCreatedBy),
    });

    if (!user) {
      throw new Error(
        `Пользователя с id=${pprInfoRes[0].pprs_info.idUserCreatedBy}, создавшего ППР id=${id}, не существует`
      );
    }

    return returnSuccess({
      data: {
        ...pprInfoRes[0].pprs_info,
        created_by: user,
        workingMans: workingMans,
        months_statuses: pprMonthStatuses[0],
        raports_notes: raportsNotes[0],
        data: pprData,
        directionShortName: pprInfoRes[0].directions?.shortName,
        distanceShortName: pprInfoRes[0].distances?.shortName,
        subdivisionShortName: pprInfoRes[0].subdivisions?.shortName,
      },
      message: `Годовой план загружен id=${id}`,
    });
  } catch (e) {
    return await returnError({ message: `Ошибка при загрузке Годового плана id=${id}. ${e}` });
  }
}

export async function createPprTable(name: string, year: number): Promise<IServerActionReturn> {
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

    await db.insert(pprRaportsNotesTable).values({ idPpr: newPprId[0].id });

    const response = await returnSuccess({ message: `Годовой план ${name} создан` });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({ message: `Ошибка при создании Годового плана ${name} на ${year} г. ${e}` });
  }
}

export async function copyPprTable(params: {
  instancePprId: number;
  name: string;
  year: number;
  isCopyPlanWork?: boolean;
  isCopyFactWork?: boolean;
  isCopyPlanWorkingMans?: boolean;
  isCopyFactWorkingMans?: boolean;
}): Promise<IServerActionReturn> {
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

      await tx.insert(pprRaportsNotesTable).values({ idPpr: newPprId });
    });

    const response = await returnSuccess({ message: "Годовой план создан на основе шаблона" });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({
      message: `При копировании Годового плана ${params.name} ${params.year} по Плану id=${params.instancePprId} произошла ошибка. ${e}`,
    });
  }
}

export async function updatePprTable(id: number, params: Partial<Omit<IPpr, "id">>): Promise<IServerActionReturn> {
  try {
    await db.transaction(async (tx) => {
      if (params.status) {
        await tx.update(pprsInfoTable).set({ status: params.status }).where(eq(pprsInfoTable.id, id));
      }

      if (params.months_statuses) {
        await tx
          .update(pprMonthsStatusesTable)
          .set({ ...params.months_statuses })
          .where(eq(pprMonthsStatusesTable.idPpr, id));
      }

      if (params.raports_notes) {
        await tx
          .update(pprRaportsNotesTable)
          .set({ ...params.raports_notes })
          .where(eq(pprRaportsNotesTable.idPpr, id));
      }

      if (params.workingMans?.length) {
        await tx
          .insert(pprWorkingMansTable)
          .values(
            params.workingMans.map((workingMan) => {
              if (typeof workingMan.id === "string") {
                return { ...workingMan, id: undefined, idPpr: id };
              }
              return { ...workingMan, id: workingMan.id, idPpr: id };
            })
          )
          .onDuplicateKeyUpdate({
            set: buildConflictUpdateColumns(pprWorkingMansTable, [
              "full_name",
              "work_position",
              "participation",
              ...PLAN_TIME_FIELDS,
              ...PLAN_NORM_TIME_FIELDS,
              ...PLAN_TABEL_TIME_FIELDS,
              ...FACT_TIME_FIELDS,
            ]),
          });
      } else if (params.workingMans?.length === 0) {
        await tx.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id));
      }

      if (params.data?.length) {
        await tx
          .insert(pprsWorkDataTable)
          .values(
            params.data.map((pprData, index) => {
              if (typeof pprData.id === "string") {
                return { ...pprData, id: undefined, idPpr: id, order: index };
              }
              return { ...pprData, id: pprData.id, idPpr: id, order: index };
            })
          )
          .onDuplicateKeyUpdate({
            set: buildConflictUpdateColumns(pprsWorkDataTable, [
              "order",
              "common_work_id",
              "is_work_aproved",
              "branch",
              "subbranch",
              "note",
              ...PPR_DATA_BASIC_FIELDS,
              ...PLAN_WORK_FIELDS,
              ...PLAN_TIME_FIELDS,
              ...FACT_WORK_FIELDS,
              ...FACT_NORM_TIME_FIELDS,
              ...FACT_TIME_FIELDS,
            ]),
          });
      } else if (params.data?.length === 0) {
        await tx.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id));
      }
    });

    const response = await returnSuccess({ message: "Годовой план обновлен" });

    revalidatePath(`${ROUTE_PPR}/${id}`);

    return response;
  } catch (e) {
    return await returnError({ message: `При обновлении Годового плана id=${id} произошла ошибка. ${e}` });
  }
}

export async function deletePprTable(id: number): Promise<IServerActionReturn> {
  try {
    await db.transaction(async (tx) => {
      await Promise.all([
        tx.delete(pprMonthsStatusesTable).where(eq(pprMonthsStatusesTable.idPpr, id)),
        tx.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id)),
        tx.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id)),
        tx.delete(pprRaportsNotesTable).where(eq(pprRaportsNotesTable.idPpr, id)),
        tx.delete(pprsInfoTable).where(eq(pprsInfoTable.id, id)),
      ]).catch((e) => {
        throw new Error(e);
      });
    });

    const response = await returnSuccess({ message: "Годовой план удален" });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({ message: `При удалении Годового плана id=${id} произошла ошибка. ${e}` });
  }
}

export async function getManyPprsShortInfo(params?: {
  name?: string;
  year?: number | string;
  idDirection?: number | null | string;
  idDistance?: number | null | string;
  idSubdivision?: number | null | string;
  status?: string;
  months_statuses?: string | string[];
}): Promise<IServerActionReturn<TPprShortInfo[]>> {
  const filters: SQL[] = [];

  if (params?.name) filters.push(like(pprsInfoTable.name, `%${params.name}%`));
  if (params?.year) filters.push(eq(pprsInfoTable.year, Number(params.year)));
  if (params?.idDirection) filters.push(eq(pprsInfoTable.idDirection, Number(params.idDirection)));
  if (params?.idDistance) filters.push(eq(pprsInfoTable.idDistance, Number(params.idDistance)));
  if (params?.idSubdivision) filters.push(eq(pprsInfoTable.idSubdivision, Number(params.idSubdivision)));
  if (params?.status) filters.push(eq(pprsInfoTable.status, params.status as TYearPprStatus));
  if (params?.months_statuses && typeof params.months_statuses === "object") {
    const monthStatusesFilter: SQL[] = [];

    params.months_statuses.forEach((status) => {
      const compareResult = or(...MONTHS.map((month) => eq(pprMonthsStatusesTable[month], status as TMonthPprStatus)));
      compareResult && monthStatusesFilter.push(compareResult);
    });

    const result = or(...monthStatusesFilter);

    result && filters.push(result);
  } else if (params?.months_statuses && typeof params.months_statuses === "string") {
    const compareResult = or(
      ...MONTHS.map((month) => eq(pprMonthsStatusesTable[month], params.months_statuses as TMonthPprStatus))
    );
    compareResult && filters.push(compareResult);
  }

  try {
    const data = await db
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
      .innerJoin(usersTable, eq(pprsInfoTable.idUserCreatedBy, usersTable.id))
      .innerJoin(pprMonthsStatusesTable, eq(pprsInfoTable.id, pprMonthsStatusesTable.idPpr))
      .leftJoin(directionsTable, eq(pprsInfoTable.idDirection, directionsTable.id))
      .leftJoin(distancesTable, eq(pprsInfoTable.idDistance, distancesTable.id))
      .leftJoin(subdivisionsTable, eq(pprsInfoTable.idSubdivision, subdivisionsTable.id))
      .where(and(...filters));

    return await returnSuccess({ data, message: "Список Годовых планов сформирован" });
  } catch (e) {
    return await returnError({
      message: `При формировании общего списка Годовых планов произошла ошибка. ${e}`,
    });
  }
}

export async function deletePprWork(id: number): Promise<IServerActionReturn> {
  try {
    await db.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.id, id));

    return await returnSuccess({ message: "Работа исключена из планов" });
  } catch (e) {
    return await returnError({ message: `Произошла ошибка при исключении работы id=${id} из плана` });
  }
}

export async function deleteWorkingMan(id: number): Promise<IServerActionReturn> {
  try {
    await db.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.id, id));

    return await returnSuccess({ message: "Работник исключен из планов" });
  } catch (e) {
    return await returnError({ message: `Произошла ошибка при исключении работника id=${id} из плана` });
  }
}

export interface IGetPprDataForReportParams {
  year?: string;
  status?: string;
  idSubdivision?: string;
  idDistance?: string;
  idDirection?: string;
  workId?: string;
}

export type TPprDataForReport = IPprData & {
  idDirection: number;
  idDistance: number;
  idSubdivision: number;
  directionShortName: string;
  distanceShortName: string;
  subdivisionShortName: string;
};

export async function getPprDataForReport({
  workId,
  year,
  status,
  idDistance,
  idDirection,
  idSubdivision,
}: IGetPprDataForReportParams): Promise<IServerActionReturn<TPprDataForReport[]>> {
  try {
    const filters: SQL[] = [];

    if (!year) {
      return await returnError({ data: [], message: "Не задан год для формирования отчета" });
    }

    if (year) filters.push(eq(pprsInfoTable.year, Number(year)));
    if (status) filters.push(like(pprsInfoTable.status, status));
    if (workId) filters.push(eq(pprsWorkDataTable.common_work_id, Number(workId)));
    if (idDistance) filters.push(eq(pprsInfoTable.idDistance, Number(idDistance)));
    if (idDirection) filters.push(eq(pprsInfoTable.idDirection, Number(idDirection)));
    if (idSubdivision) filters.push(eq(pprsInfoTable.idSubdivision, Number(idSubdivision)));

    const result = await db
      .select()
      .from(pprsWorkDataTable)
      .leftJoin(pprsInfoTable, eq(pprsWorkDataTable.idPpr, pprsInfoTable.id))
      .leftJoin(subdivisionsTable, eq(pprsInfoTable.idSubdivision, subdivisionsTable.id))
      .leftJoin(distancesTable, eq(pprsInfoTable.idDistance, distancesTable.id))
      .leftJoin(directionsTable, eq(pprsInfoTable.idDirection, directionsTable.id))
      .where(
        and(
          isNotNull(pprsInfoTable.idSubdivision),
          isNotNull(pprsInfoTable.idDistance),
          isNotNull(pprsInfoTable.idDirection),
          ...filters
        )
      )
      .orderBy(
        pprsWorkDataTable.common_work_id,
        pprsInfoTable.idDirection,
        pprsInfoTable.idDistance,
        pprsInfoTable.idSubdivision
      );

    return await returnSuccess({
      data: result.map((data) => ({
        ...data.pprs_data,
        idDirection: data.pprs_info?.idDirection!,
        idDistance: data.pprs_info?.idDistance!,
        idSubdivision: data.pprs_info?.idSubdivision!,
        directionShortName: data.directions?.shortName!,
        distanceShortName: data.distances?.shortName!,
        subdivisionShortName: data.subdivisions?.shortName!,
      })),
      message: "Данные загружены для формирования отчета",
    });
  } catch (e) {
    return await returnError({ message: `Произошла ошибка при формировании отчета. ${e}` });
  }
}
