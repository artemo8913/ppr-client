"use server";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";

import { createBranchesMeta } from "@/1shared/providers/pprProvider/lib/createBranchesMeta";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import { translateRuFieldName } from "@/1shared/locale/pprFieldNames";
import { TIME_PERIODS } from "@/1shared/const/date";
import { translateRuTimePeriod } from "@/1shared/locale/date";
import { authOptions } from "@/1shared/auth/authConfig";
import {
  checkIsWorkOrTimeField,
  IPpr,
  IPprData,
  PLAN_TIME_FIELDS,
  PLAN_WORK_FIELDS,
  PPR_DATA_BASIC_FIELDS,
  PPR_DATA_FIELDS,
} from "@/2entities/ppr";

import { setBgColorXlsx } from "./setBgColorXlsx";

const PPR_YEAR_PLAN_SHEET_NAME = "Годовой план";

const MAX_COLUMNS_COUNT = 77;

const TIME_PERIOD_COL_SPAN = 5;

const START_COLUMNS_INDEX = 6;

const START_ROWS_INDEX = 3;

const FIRST_ROW_INDEX = 1;

const SECOND_ROW_INDEX = 2;

const MIN_COL_WIDTH = 3;

const HEADER_HEIGHT = 400;

const COLUMNS_WIDTH: { [key in keyof IPprData]?: number } = {
  name: 40,
  location: 20,
  line_class: 3,
  total_count: 3,
  entry_year: 3,
  periodicity_normal: 3,
  periodicity_fact: 3,
  last_maintenance_year: 3,
  norm_of_time: 3,
  norm_of_time_document: 10,
  measure: 10,
  unity: 3,
};

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

const BLACK_BORDER: Partial<ExcelJS.Borders> = {
  bottom: { color: { argb: "FF000000" }, style: "thin" },
  left: { color: { argb: "FF000000" }, style: "thin" },
  right: { color: { argb: "FF000000" }, style: "thin" },
  top: { color: { argb: "FF000000" }, style: "thin" },
};

const VERTICAL_ALIGNMENT: Partial<ExcelJS.Alignment> = { wrapText: true, textRotation: 90, horizontal: "center" };
const CENTER_ALIGNMENT: Partial<ExcelJS.Alignment> = { wrapText: true, horizontal: "center" };

async function setWorkbookProperties(workbook: ExcelJS.Workbook) {
  const session = await getServerSession(authOptions);

  workbook.creator = `${session?.user.lastName}`;
  workbook.lastModifiedBy = `${session?.user.lastName}`;
  workbook.company = `${session?.user.directionShortName}`;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
}

export async function pprConvertToXlsx(ppr: IPpr) {
  const workbook = new ExcelJS.Workbook();

  await setWorkbookProperties(workbook);

  const { branchesAndSubbrunchesOrder } = createBranchesMeta(ppr.data);

  const yearPlanSheet = workbook.addWorksheet(PPR_YEAR_PLAN_SHEET_NAME, WORKSHEET_OPTIONS);

  // Задать заголовки таблицы
  yearPlanSheet.columns = PPR_DATA_FIELDS.map((field) => ({
    key: field,
    width: COLUMNS_WIDTH[field] || MIN_COL_WIDTH,
    hidden:
      field === "is_work_aproved" ||
      field === "common_work_id" ||
      field === "id" ||
      field === "branch" ||
      field === "subbranch",
  }));

  // Счетчик столбцов (для построения шапки таблицы)
  let colIndex = START_COLUMNS_INDEX;

  // Ячейки шапки таблицы до временных периодов
  PPR_DATA_BASIC_FIELDS.forEach((field) => {
    // Объединить ячейки
    yearPlanSheet.mergeCells(FIRST_ROW_INDEX, colIndex, SECOND_ROW_INDEX, colIndex);

    const cell = yearPlanSheet.getCell(FIRST_ROW_INDEX, colIndex);
    // Стилизация ячейки
    cell.value = translateRuFieldName(field);
    cell.alignment = VERTICAL_ALIGNMENT;
    cell.border = BLACK_BORDER;

    // Увеличить lastColIndex
    colIndex++;
  });

  yearPlanSheet.getRow(2).height = HEADER_HEIGHT;

  // Ячейки шапки таблицы временных периодов
  TIME_PERIODS.forEach((period) => {
    // Объединить ячейки
    yearPlanSheet.mergeCells(FIRST_ROW_INDEX, colIndex, FIRST_ROW_INDEX, colIndex + TIME_PERIOD_COL_SPAN - 1);

    const cell = yearPlanSheet.getCell(FIRST_ROW_INDEX, colIndex);
    // Стилизация ячейки (месяц)
    cell.value = translateRuTimePeriod(period);
    cell.alignment = CENTER_ALIGNMENT;
    cell.border = BLACK_BORDER;

    // Стилизация заголовков столбов план/факт
    [
      `${period}_plan_work`,
      `${period}_plan_time`,
      `${period}_fact_work`,
      `${period}_fact_norm_time`,
      `${period}_fact_time`,
    ].map((field) => {
      const planFactCell = yearPlanSheet.getCell(SECOND_ROW_INDEX, colIndex);
      planFactCell.value = translateRuFieldName(field);
      planFactCell.alignment = VERTICAL_ALIGNMENT;
      planFactCell.border = BLACK_BORDER;
      planFactCell.fill = {
        fgColor: { argb: setBgColorXlsx(field) },
        type: "pattern",
        pattern: "solid",
      };

      colIndex++;
    });
  });

  // Добавить данные в таблицу
  ppr.data.map((pprData, index) => {
    // Создание ячеек категорий и подкатегорий
    if (index in branchesAndSubbrunchesOrder) {
      branchesAndSubbrunchesOrder[index].forEach((branch, subIndex) => {
        yearPlanSheet.mergeCells(
          START_ROWS_INDEX + index + subIndex,
          START_COLUMNS_INDEX,
          START_ROWS_INDEX + index + subIndex,
          START_COLUMNS_INDEX + MAX_COLUMNS_COUNT - 1
        );

        const branchTitleCell = yearPlanSheet.getCell(START_ROWS_INDEX + index + subIndex, START_COLUMNS_INDEX);

        // Стилизация ячеек категорий и подкатегорий
        branchTitleCell.value = `${branch.orderIndex} ${translateRuPprBranchName(branch.name)}`;
        branchTitleCell.border = BLACK_BORDER;
        branchTitleCell.alignment = { horizontal: "left" };
      });
    }

    const finalData: any = { ...pprData };

    PLAN_WORK_FIELDS.map((field) => (finalData[field] = finalData[field].final));
    PLAN_TIME_FIELDS.map((field) => (finalData[field] = finalData[field].final));

    const row = yearPlanSheet.addRow(finalData);

    PPR_DATA_FIELDS.forEach((field) => {
      const cell = row.getCell(field);

      // Стилизация ячеек данных
      cell.border = BLACK_BORDER;
      cell.alignment = { wrapText: true };

      cell.fill = {
        fgColor: { argb: setBgColorXlsx(field) },
        type: "pattern",
        pattern: "solid",
      };

      if (
        checkIsWorkOrTimeField(field) ||
        field === "total_count" ||
        field === "entry_year" ||
        field === "last_maintenance_year" ||
        field === "periodicity_fact" ||
        field === "periodicity_normal" ||
        field === "line_class" ||
        field === "unity" ||
        field === "norm_of_time"
      ) {
        cell.alignment = VERTICAL_ALIGNMENT;
      }
    });
  });

  return workbook;
}
