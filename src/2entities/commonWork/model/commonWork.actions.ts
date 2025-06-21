"use server";
import { db } from "@/1shared/database";

import { CommonWork } from "./commonWork.types";

export async function getCommonWorks(): Promise<CommonWork[]> {
  return db.query.commonWorksTable.findMany();
}
