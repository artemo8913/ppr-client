"use server";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { IPpr } from "@/2entities/ppr";
import { addYearPlanSheet } from "./createYearPlanSheet";

const TITLE_SHEET_NAME = "Титульный лист";

const PPR_WORKING_MANS_SHEET_NAME = "Таблица 1";

const PPR_REALIZATION_SHEET_NAME = "Таблица 2";

const PPR_YEAR_PLAN_SHEET_NAME = "Таблица 3";

const WORKSHEET_OPTIONS: Partial<ExcelJS.AddWorksheetOptions> = {
  pageSetup: {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    margins: {
      left: 0.2,
      right: 0.1,
      top: 0.1,
      bottom: 0.1,
      header: 0.1,
      footer: 0.1,
    },
  },
};

export async function pprConvertToXlsx(ppr: IPpr) {
  const workbook = new ExcelJS.Workbook();

  const session = await getServerSession(authOptions);

  workbook.creator = `${session?.user.lastName}`;
  workbook.lastModifiedBy = `${session?.user.lastName}`;
  workbook.company = `${session?.user.directionShortName}`;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const yearPlanSheet = addYearPlanSheet({
    ppr,
    workbook,
    sheetName: PPR_YEAR_PLAN_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
  });

  return workbook;
}
