"use server";
import { eq } from "drizzle-orm";

import { db } from "@/1shared/database";

import { ICommonWork } from "./commonWork.types";
import { commonWorksTable } from "./commonWork.schema";

export async function getCommonWorks(): Promise<ICommonWork[]> {
  return db.query.commonWorksTable.findMany();
}

export async function getOneCommonWorkById(id: number): Promise<ICommonWork> {
  const commonWork = await db.query.commonWorksTable.findFirst({ where: eq(commonWorksTable.id, id) });

  if (!commonWork) {
    throw new Error(`Common work with id = ${id} not exist`);
  }

  return commonWork;
}
