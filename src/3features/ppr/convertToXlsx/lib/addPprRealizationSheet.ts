import ExcelJS from "exceljs";
import { TTotalFieldsValues } from "@/2entities/ppr";
import { createCellWithBorderAndCenterAlignmentAndWrap, createHeaderCell } from "./xlsxStyles";

interface IAddPprRealizationSheetArgs {
  workbook: ExcelJS.Workbook;
  totalFieldsValues: TTotalFieldsValues;
  sheetName?: string;
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
}

export function addPprRealizationSheet({
  workbook,
  totalFieldsValues,
  sheetName,
  sheetOptions,
}: IAddPprRealizationSheetArgs): ExcelJS.Worksheet {
  const pprRealizationSheet = workbook.addWorksheet(sheetName, sheetOptions);

  // Заголовок
  pprRealizationSheet.getColumn(1).width = 15;
  pprRealizationSheet.getColumn(2).width = 25;
  pprRealizationSheet.getRow(4).height = 40;

  createHeaderCell(pprRealizationSheet, "C1", "ИСПОЛНЕНИЕ");
  createHeaderCell(pprRealizationSheet, "C2", "нормированного задания");

  pprRealizationSheet.mergeCells("A3:B3");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "A3", "Нормированное задание, чел.-ч");

  pprRealizationSheet.mergeCells("A4:A5");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "A4", "всего");

  pprRealizationSheet.mergeCells("B4:B5");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "B4", "в том числе по эксплуатационному плану");

  pprRealizationSheet.mergeCells("C3:F3");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "C3", "Выполнение нормированного задания");

  pprRealizationSheet.mergeCells("C4:D4");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "C4", "Всего");

  pprRealizationSheet.mergeCells("E4:F4");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "E4", "в том числе эксплуатационного");

  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "C5", "чел.-ч");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "D5", "%");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "E5", "чел.-ч");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "F5", "%");

  // Данные таблицы
  const pprRealizationPercent =
    totalFieldsValues.works.year_fact_norm_time !== undefined && totalFieldsValues.peoples.year_plan_time
      ? ((totalFieldsValues.works.year_fact_norm_time / totalFieldsValues.peoples.year_plan_time) * 100).toFixed(2)
      : "-";

  const pprRealizationExploitationPercent =
    totalFieldsValues.works.year_plan_time !== undefined && totalFieldsValues.works.year_fact_norm_time
      ? ((totalFieldsValues.works.year_plan_time / totalFieldsValues.works.year_fact_norm_time) * 100).toFixed(2)
      : "-";

  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "A6", totalFieldsValues.peoples.year_plan_time);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "B6", totalFieldsValues.works.year_plan_time);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "C6", totalFieldsValues.works.year_fact_norm_time);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "D6", `${pprRealizationPercent} %`);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "E6");
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "F6", `${pprRealizationExploitationPercent} %`);

  return pprRealizationSheet;
}
