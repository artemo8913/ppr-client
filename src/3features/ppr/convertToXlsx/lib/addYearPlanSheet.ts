import ExcelJS from "exceljs";

import { createPprMeta } from "@/1shared/providers/pprProvider/lib/createPprMeta";
import { translateRuPprBranchName } from "@/1shared/locale/pprBranches";
import { translateRuFieldName } from "@/1shared/locale/pprFieldNames";
import { TIME_PERIODS } from "@/1shared/const/date";
import { translateRuTimePeriod } from "@/1shared/locale/date";
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
import { BLACK_BORDER_FULL, CENTER_ALIGNMENT_WITH_WRAP, VERTICAL_ALIGNMENT } from "./xlsxStyles";

const MAX_COLUMNS_COUNT = 77;

const TIME_PERIOD_COL_SPAN = 5;

const START_COLUMNS_INDEX = 6;

const START_ROWS_INDEX = 3;

const FIRST_ROW_INDEX = 1;

const SECOND_ROW_INDEX = 2;

const MIN_COL_WIDTH = 3;

const HEADER_HEIGHT = 400;

const COLUMNS_WIDTH: { [key in keyof IPprData]?: number } = {
  is_work_aproved: 10,
  common_work_id: 10,
  id: 10,
  branch: 15,
  subbranch: 40,
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

interface IAddYearPlanSheetArgs {
  workbook: ExcelJS.Workbook;
  ppr: IPpr;
  sheetName?: string;
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
}

export function addYearPlanSheet({ ppr, workbook, sheetName, sheetOptions }: IAddYearPlanSheetArgs) {
  const yearPlanSheet = workbook.addWorksheet(sheetName, sheetOptions);

  const { branchesAndSubbrunchesOrder } = createPprMeta(ppr.data);

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
    cell.border = BLACK_BORDER_FULL;

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
    cell.alignment = CENTER_ALIGNMENT_WITH_WRAP;
    cell.border = BLACK_BORDER_FULL;

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
      planFactCell.border = BLACK_BORDER_FULL;
      planFactCell.fill = {
        fgColor: { argb: setBgColorXlsx(field) },
        type: "pattern",
        pattern: "solid",
      };

      colIndex++;
    });
  });

  let lastRowIndex = START_ROWS_INDEX;

  // Добавить данные в таблицу
  ppr.data.map((pprData, index) => {
    // Создание ячеек категорий и подкатегорий
    if (index in branchesAndSubbrunchesOrder) {
      branchesAndSubbrunchesOrder[index].forEach((branch, subIndex) => {
        yearPlanSheet.mergeCells(
          lastRowIndex + index + subIndex,
          START_COLUMNS_INDEX,
          lastRowIndex + index + subIndex,
          START_COLUMNS_INDEX + MAX_COLUMNS_COUNT - 1
        );

        const branchTitleCell = yearPlanSheet.getCell(lastRowIndex + index + subIndex, START_COLUMNS_INDEX);

        // Стилизация ячеек категорий и подкатегорий
        branchTitleCell.value = `${branch.orderIndex} ${translateRuPprBranchName(branch.name)}`;
        branchTitleCell.border = BLACK_BORDER_FULL;
        branchTitleCell.alignment = { horizontal: "left" };
      });
    }

    const finalData: any = { ...pprData };

    PLAN_WORK_FIELDS.map((field) => (finalData[field] = finalData[field].final));
    PLAN_TIME_FIELDS.map((field) => (finalData[field] = finalData[field].final));

    const row = yearPlanSheet.addRow(finalData);

    lastRowIndex = row.number;

    PPR_DATA_FIELDS.forEach((field) => {
      const cell = row.getCell(field);

      // Стилизация ячеек данных
      cell.border = BLACK_BORDER_FULL;
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

  return yearPlanSheet;
}
