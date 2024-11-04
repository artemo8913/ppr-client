import ExcelJS from "exceljs";

import { roundToFixed } from "@/1shared/lib/math";
import { IWorkingManYearPlan, TWorkingManFieldsTotalValues } from "@/2entities/ppr";

import {
  createHeaderCell,
  createCellWithBorderAndCenterAlignmentAndWrap,
  CENTER_ALIGNMENT,
  BLACK_BORDER_FULL,
  BOLD,
} from "./xlsxStyles";

type TWorkingMansSheetColumns = keyof IWorkingManYearPlan | "people_count";

const SHEET_TABLE_COLUMNS: TWorkingMansSheetColumns[] = [
  "full_name",
  "people_count",
  "year_plan_norm_time",
  "year_plan_tabel_time",
  "participation",
  "year_plan_time",
];

const EMPTY_ROWS_COUNT = 5;

const COLUMNS_WIDTH: { [key in TWorkingMansSheetColumns]?: number } = {
  full_name: 50,
  people_count: 15,
  year_plan_norm_time: 10,
  year_plan_tabel_time: 10,
  participation: 10,
  year_plan_time: 10,
};

interface IAddTitleSheetArgs {
  workbook: ExcelJS.Workbook;
  workingMans: IWorkingManYearPlan[];
  totalValue: TWorkingManFieldsTotalValues;
  sheetName?: string;
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
}

export function addWorkingMansSheet({
  workbook,
  workingMans,
  totalValue,
  sheetName,
  sheetOptions,
}: IAddTitleSheetArgs): ExcelJS.Worksheet {
  const workingMansSheet = workbook.addWorksheet(sheetName, sheetOptions);

  // Заголовок
  createHeaderCell(workingMansSheet, "B1", "ГОДОВОЙ ФОНД");
  createHeaderCell(workingMansSheet, "B2", "рабочего времени");

  workingMansSheet.columns = SHEET_TABLE_COLUMNS.map((field) => ({
    key: field,
    width: COLUMNS_WIDTH[field],
  }));

  // Шапка таблицы
  workingMansSheet.mergeCells("A3:A4");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "A3", "Должность, профессия, разряд рабочих");
  workingMansSheet.mergeCells("B3:B4");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "B3", "Фактическая численность, чел.");
  workingMansSheet.mergeCells("C3:D3");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "C3", "Годовой фонд рабочего времени, чел.-ч");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "C4", "По норме");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "D4", "По табелю");
  workingMansSheet.mergeCells("E3:F3");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "E3", "Нормированное задание");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "E4", "Доля участия, %");
  createCellWithBorderAndCenterAlignmentAndWrap(workingMansSheet, "F4", "чел.-ч");

  // Нумерация столбцов таблицы
  SHEET_TABLE_COLUMNS.forEach((field, index) => {
    const colNum = workingMansSheet.getColumn(field).number;

    const cell = workingMansSheet.getCell(5, colNum);
    cell.value = index + 1;
    cell.alignment = CENTER_ALIGNMENT;
    cell.border = BLACK_BORDER_FULL;
  });

  workingMans.forEach((man) => {
    const finalData = {
      full_name: `${man.full_name} - ${man.work_position}`,
      people_count: 1,
      year_plan_norm_time: man.year_plan_norm_time,
      year_plan_tabel_time: man.year_plan_tabel_time,
      participation: roundToFixed(man.participation * 100),
      year_plan_time: man.year_plan_time,
    };

    workingMansSheet.addRow(finalData).eachCell((cell) => {
      cell.border = BLACK_BORDER_FULL;
      cell.alignment = CENTER_ALIGNMENT;
    });
  });

  workingMansSheet.addRows(new Array(EMPTY_ROWS_COUNT).fill({})).forEach((row) => {
    SHEET_TABLE_COLUMNS.forEach((field) => {
      const cell = row.getCell(field);

      cell.border = BLACK_BORDER_FULL;
      cell.alignment = CENTER_ALIGNMENT;
    });
  });

  workingMansSheet
    .addRow({
      full_name: "Итого",
      people_count: workingMans.length,
      year_plan_norm_time: totalValue.year_plan_norm_time,
      year_plan_tabel_time: totalValue.year_plan_tabel_time,
      year_plan_time: totalValue.year_plan_time,
    })
    .eachCell((cell) => {
      cell.border = BLACK_BORDER_FULL;
      cell.alignment = CENTER_ALIGNMENT;
      cell.font = BOLD;
    });

  return workingMansSheet;
}
