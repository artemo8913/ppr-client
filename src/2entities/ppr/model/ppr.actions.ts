"use server";
import { and, eq, isNotNull, like, or, SQL } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/1shared/auth";
import { ROUTE_PPR } from "@/1shared/lib/routes";
import { db, DatabaseTransactionType } from "@/1shared/database";
import { Month, MONTHS, TIME_PERIODS } from "@/1shared/lib/date";
import { ServerActionReturn, returnError, returnSuccess } from "@/1shared/serverAction";
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
  YearPlan,
  PlannedWorkWithCorrections,
  AllFactNormTimes,
  AllFactTimes,
  AllFactValues,
  MonthPlanStatus,
  AllPlanNormTimes,
  AllPlanTabelTimes,
  AllPlanTimes,
  AllPlanValuesWithCorrections,
  YearPlanBasicData,
  AllPlanTimesWithCorrections,
  YearPlanStatus,
} from "./ppr.types";
import {
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
  PLAN_WORK_FIELDS,
  PPR_DATA_BASIC_FIELDS,
} from "./ppr.const";
import { PprField } from "./PprField";
import {
  getNextPprMonthStatus,
  getNextPprYearStatus,
  getRejectedMonthPlanStatus,
  getRejectedYearPlanStatus,
} from "../lib/pprStatusHelper";

export async function getPprTable(id: number): Promise<ServerActionReturn<YearPlan>> {
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
      message: `План ТОиР загружен id=${id}`,
    });
  } catch (e) {
    return await returnError({ message: `Ошибка при загрузке плана ТОиР id=${id}. ${e}` });
  }
}

export async function createPprTable(name: string, year: number): Promise<ServerActionReturn> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(`Session not exist`);
    }

    const isSubdivision = session.user.role === "subdivision";

    const status: YearPlanStatus = isSubdivision ? "plan_creating" : "template";

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

    const response = await returnSuccess({ message: `План ТОиР ${name} создан` });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({ message: `Ошибка при создании плана ТОиР ${name} на ${year} г. ${e}` });
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
}): Promise<ServerActionReturn> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error(`Session not exist`);
    }

    const isSubdivision = session.user.role === "subdivision";

    const status: YearPlanStatus = isSubdivision ? "plan_creating" : "template";

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
            const planWork: Partial<AllPlanValuesWithCorrections> = {};
            const planTime: Partial<AllPlanTimesWithCorrections> = {};
            const factWork: Partial<AllFactValues> = {};
            const factNormTime: Partial<AllFactNormTimes> = {};
            const factTime: Partial<AllFactTimes> = {};

            TIME_PERIODS.forEach((period) => {
              const { planWorkField, planTimeField, factWorkField, factNormTimeField, factTimeField } =
                PprField.getByTimePeriod(period);

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
            const planNormTime: Partial<AllPlanNormTimes> = {};
            const planTabelTime: Partial<AllPlanTabelTimes> = {};
            const planTime: Partial<AllPlanTimes> = {};
            const factTime: Partial<AllFactTimes> = {};

            TIME_PERIODS.forEach((period) => {
              const { planTimeField, planNormTimeField, planTabelTimeField, factTimeField } =
                PprField.getByTimePeriod(period);

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

    const response = await returnSuccess({ message: "План ТОиР создан на основе шаблона" });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({
      message: `При копировании плана ТОиР ${params.name} ${params.year} по Плану id=${params.instancePprId} произошла ошибка. ${e}`,
    });
  }
}

async function approveWorksAndWorkingMans(tx: DatabaseTransactionType, yearPlanId: number) {
  return Promise.all([
    tx.update(pprsWorkDataTable).set({ is_work_aproved: true }).where(eq(pprsWorkDataTable.idPpr, yearPlanId)),
    tx
      .update(pprWorkingMansTable)
      .set({ is_working_man_aproved: true })
      .where(eq(pprWorkingMansTable.idPpr, yearPlanId)),
  ]);
}

export async function updateYearPlanStatus(yearPlanId: number): Promise<ServerActionReturn> {
  try {
    db.transaction(async (tx) => {
      const yearPlan = await tx.query.pprsInfoTable.findFirst({ where: eq(pprsInfoTable.id, yearPlanId) });

      if (!yearPlan) {
        throw new Error(`Годовой план с id=${yearPlanId} не найден`);
      }

      const nextStatus = getNextPprYearStatus(yearPlan.status);

      if (!nextStatus) {
        throw new Error(`Годовой план с id=${yearPlanId} не взоможно обновить`);
      }

      if (nextStatus === "in_process") {
        await approveWorksAndWorkingMans(tx, yearPlanId);
      }

      await tx.update(pprsInfoTable).set({ status: nextStatus }).where(eq(pprsInfoTable.id, yearPlanId));
    });

    const response = await returnSuccess({ message: "Статус годового плана успешно обновлен" });

    revalidatePath(`${ROUTE_PPR}/${yearPlanId}`);

    return response;
  } catch (e) {
    return await returnError({
      message: `При обновлении статуса годового плана произошла ошибка. ${e}`,
    });
  }
}

export async function rejectYearPlanStatus(yearPlanId: number): Promise<ServerActionReturn> {
  try {
    await db.update(pprsInfoTable).set({ status: getRejectedYearPlanStatus() }).where(eq(pprsInfoTable.id, yearPlanId));

    const response = await returnSuccess({ message: "Годовой план отклонен" });

    revalidatePath(`${ROUTE_PPR}/${yearPlanId}`);

    return response;
  } catch (e) {
    return await returnError({
      message: `При отклонении годового плана id=${yearPlanId} произошла ошибка. ${e}`,
    });
  }
}

export async function updateMonthPlanStatus(yearPlanId: number, month: Month): Promise<ServerActionReturn> {
  try {
    db.transaction(async (tx) => {
      const monthStatuses = await tx.query.pprMonthsStatusesTable.findFirst({
        where: eq(pprMonthsStatusesTable.idPpr, yearPlanId),
      });

      if (!monthStatuses) {
        throw new Error(`Статусы месячных планов id=${yearPlanId} не найдены`);
      }

      const nextStatus = getNextPprMonthStatus(monthStatuses[month]);

      if (!nextStatus) {
        throw new Error(`Месячный план id=${yearPlanId} на месяц=${month} не взоможно обновить`);
      }

      if (nextStatus === "in_process") {
        await approveWorksAndWorkingMans(tx, yearPlanId);
      }

      await tx
        .update(pprMonthsStatusesTable)
        .set({ [month]: nextStatus })
        .where(eq(pprMonthsStatusesTable.idPpr, yearPlanId));
    });

    const response = await returnSuccess({ message: "Статус месячного плана успешно обновлен" });

    revalidatePath(`${ROUTE_PPR}/${yearPlanId}`);

    return response;
  } catch (e) {
    return await returnError({
      message: `При обновлении месячного плана id=${yearPlanId} месяц=${month} произошла ошибка. ${e}`,
    });
  }
}

export async function rejectMonthPlanStatus(yearPlanId: number, month: Month): Promise<ServerActionReturn> {
  try {
    const monthStatuses = await db.query.pprMonthsStatusesTable.findFirst({
      where: eq(pprMonthsStatusesTable.idPpr, yearPlanId),
    });

    if (!monthStatuses) {
      throw new Error(`Статусы месячных планов id=${yearPlanId} не найдены`);
    }

    await db
      .update(pprMonthsStatusesTable)
      .set({ [month]: getRejectedMonthPlanStatus(monthStatuses[month]) })
      .where(eq(pprMonthsStatusesTable.idPpr, yearPlanId));

    const response = await returnSuccess({ message: "Месячный план отклонен" });

    revalidatePath(`${ROUTE_PPR}/${yearPlanId}`);

    return response;
  } catch (e) {
    return await returnError({
      message: `При отклонении месячного плана месячного плана id=${yearPlanId} месяц=${month} произошла ошибка. ${e}`,
    });
  }
}

export async function saveYearPlan(id: number, yearPlan: Partial<Omit<YearPlan, "id">>): Promise<ServerActionReturn> {
  try {
    await db.transaction(async (tx) => {
      if (yearPlan.raports_notes) {
        await tx
          .update(pprRaportsNotesTable)
          .set({ ...yearPlan.raports_notes })
          .where(eq(pprRaportsNotesTable.idPpr, id));
      }

      if (yearPlan.workingMans?.length) {
        await tx
          .insert(pprWorkingMansTable)
          .values(
            yearPlan.workingMans.map((workingMan) => {
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
      } else if (yearPlan.workingMans?.length === 0) {
        await tx.delete(pprWorkingMansTable).where(eq(pprWorkingMansTable.idPpr, id));
      }

      if (yearPlan.data?.length) {
        await tx
          .insert(pprsWorkDataTable)
          .values(
            yearPlan.data.map((pprData, index) => {
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
      } else if (yearPlan.data?.length === 0) {
        await tx.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.idPpr, id));
      }
    });

    return await returnSuccess({ message: "План технического обслуживания и ремонта сохранен" });
  } catch (e) {
    return await returnError({ message: `При обновлении плана ТОиР id=${id} произошла ошибка. ${e}` });
  }
}

export async function deletePprTable(id: number): Promise<ServerActionReturn> {
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

    const response = await returnSuccess({ message: "План технического обслуживания и ремонта удален" });

    revalidatePath(ROUTE_PPR);

    return response;
  } catch (e) {
    return await returnError({ message: `При удалении плана ТОиР id=${id} произошла ошибка. ${e}` });
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
}): Promise<ServerActionReturn<YearPlanBasicData[]>> {
  const filters: SQL[] = [];

  if (params?.name) filters.push(like(pprsInfoTable.name, `%${params.name}%`));
  if (params?.year) filters.push(eq(pprsInfoTable.year, Number(params.year)));
  if (params?.idDirection) filters.push(eq(pprsInfoTable.idDirection, Number(params.idDirection)));
  if (params?.idDistance) filters.push(eq(pprsInfoTable.idDistance, Number(params.idDistance)));
  if (params?.idSubdivision) filters.push(eq(pprsInfoTable.idSubdivision, Number(params.idSubdivision)));
  if (params?.status) filters.push(eq(pprsInfoTable.status, params.status as YearPlanStatus));
  if (params?.months_statuses && typeof params.months_statuses === "object") {
    const monthStatusesFilter: SQL[] = [];

    params.months_statuses.forEach((status) => {
      const compareResult = or(...MONTHS.map((month) => eq(pprMonthsStatusesTable[month], status as MonthPlanStatus)));
      compareResult && monthStatusesFilter.push(compareResult);
    });

    const result = or(...monthStatusesFilter);

    result && filters.push(result);
  } else if (params?.months_statuses && typeof params.months_statuses === "string") {
    const compareResult = or(
      ...MONTHS.map((month) => eq(pprMonthsStatusesTable[month], params.months_statuses as MonthPlanStatus))
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

export async function deletePprWork(id: number): Promise<ServerActionReturn> {
  try {
    await db.delete(pprsWorkDataTable).where(eq(pprsWorkDataTable.id, id));

    return await returnSuccess({ message: "Работа исключена из планов" });
  } catch (e) {
    return await returnError({ message: `Произошла ошибка при исключении работы id=${id} из плана` });
  }
}

export async function deleteWorkingMan(id: number): Promise<ServerActionReturn> {
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

export type TPprDataForReport = PlannedWorkWithCorrections & {
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
}: IGetPprDataForReportParams): Promise<ServerActionReturn<TPprDataForReport[]>> {
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
