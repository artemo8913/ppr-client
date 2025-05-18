"use server";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";

import { authOptions } from "@/1shared/auth/authConfig";
import { createPprMeta, IPpr } from "@/2entities/ppr";
import { getDirectionById, getDistanceById, getSubdivisionById } from "@/2entities/division";

import { addTitleSheet } from "./addTitleSheet";
import { addYearPlanSheet } from "./addYearPlanSheet";
import { addWorkingMansSheet } from "./addWorkingMansSheet";
import { addPprRealizationSheet } from "./addPprRealizationSheet";

const TITLE_SHEET_NAME = "Титульный лист";

const PPR_WORKING_MANS_SHEET_NAME = "Таблица 1";

const PPR_REALIZATION_SHEET_NAME = "Таблица 2";

const PPR_YEAR_PLAN_FINAL_SHEET_NAME = "Таблица 3";

const PPR_YEAR_PLAN_ORIGINAL_SHEET_NAME = "Таб.3 (без корректировок)";

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
    horizontalCentered: true,
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

  const pprMeta = createPprMeta({
    pprData: ppr.data,
    workingMansData: ppr.workingMans,
  });

  const [subdivision, distance, direction] = await Promise.all([
    (ppr.idSubdivision && (await getSubdivisionById(ppr.idSubdivision))) || null,
    (ppr.idDistance && (await getDistanceById(ppr.idDistance))) || null,
    (ppr.idDirection && (await getDirectionById(ppr.idDirection))) || null,
  ]);

  const divisions = {
    subdivision,
    distance,
    direction,
  };

  addTitleSheet({
    ppr,
    workbook,
    divisions,
    sheetName: TITLE_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
  });

  addWorkingMansSheet({
    workbook,
    workingMans: ppr.workingMans,
    totalValue: pprMeta.totalValues.final.peoples,
    sheetName: PPR_WORKING_MANS_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
  });

  addPprRealizationSheet({
    workbook,
    pprMeta,
    sheetName: PPR_REALIZATION_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
  });

  addYearPlanSheet({
    workbook,
    ppr,
    pprMeta,
    sheetName: PPR_YEAR_PLAN_FINAL_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
  });

  addYearPlanSheet({
    workbook,
    ppr,
    pprMeta,
    sheetName: PPR_YEAR_PLAN_ORIGINAL_SHEET_NAME,
    sheetOptions: WORKSHEET_OPTIONS,
    pprDataView: "original",
  });

  //Финальная обработка всех ячеек (применяем font)
  //https://github.com/exceljs/exceljs/issues/572#issuecomment-1170237178
  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        // default styles
        if (!cell.font?.size) {
          cell.font = Object.assign(cell.font || {}, { size: 10 });
        }
        if (!cell.font?.name) {
          cell.font = Object.assign(cell.font || {}, { name: "Times New Roman" });
        }
      });
    });
  });

  return workbook;
}
