import ExcelJS from "exceljs";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { IPprMeta } from "@/2entities/ppr";

import { createCellWithBorderAndCenterAlignmentAndWrap, createHeaderCell } from "./xlsxStyles";

interface IAddPprRealizationSheetArgs {
  workbook: ExcelJS.Workbook;
  pprMeta: IPprMeta;
  sheetName?: string;
  pprDataView?: "original" | "final";
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
}

export function addPprRealizationSheet({
  workbook,
  pprMeta,
  sheetName,
  sheetOptions,
  pprDataView = "original",
}: IAddPprRealizationSheetArgs): ExcelJS.Worksheet {
  const pprRealizationSheet = workbook.addWorksheet(sheetName, sheetOptions);

  const { totalValues, branchesMeta } = pprMeta;

  // Заголовок
  pprRealizationSheet.getColumn(1).width = 15;
  pprRealizationSheet.getColumn(2).width = 25;
  pprRealizationSheet.getColumn(3).width = 10;
  pprRealizationSheet.getColumn(4).width = 10;
  pprRealizationSheet.getColumn(5).width = 10;
  pprRealizationSheet.getColumn(6).width = 10;
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
    totalValues[pprDataView].works.year_fact_norm_time !== undefined && totalValues[pprDataView].workingMans.year_plan_time
      ? roundToFixed(
          (totalValues[pprDataView].works.year_fact_norm_time! / totalValues[pprDataView].workingMans.year_plan_time!) * 100
        )
      : "-";

  const pprRealizationExploitationPercent =
    totalValues[pprDataView].works.year_plan_time !== undefined && totalValues[pprDataView].works.year_fact_norm_time
      ? roundToFixed(
          (totalValues[pprDataView].works.year_plan_time! / totalValues[pprDataView].works.year_fact_norm_time!) * 100
        )
      : "-";

  let exploitationBranchFactTime = 0;

  branchesMeta.forEach((branch) => {
    if (branch.type === "branch" && branch.name === "exploitation" && branch.total[pprDataView].year_fact_norm_time) {
      exploitationBranchFactTime = roundToFixed(
        branch.total[pprDataView].year_fact_norm_time! + exploitationBranchFactTime
      );
    }
  });

  createCellWithBorderAndCenterAlignmentAndWrap(
    pprRealizationSheet,
    "A6",
    totalValues[pprDataView].workingMans.year_plan_time
  );
  createCellWithBorderAndCenterAlignmentAndWrap(
    pprRealizationSheet,
    "B6",
    totalValues[pprDataView].works.year_plan_time
  );
  createCellWithBorderAndCenterAlignmentAndWrap(
    pprRealizationSheet,
    "C6",
    totalValues[pprDataView].works.year_fact_norm_time
  );
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "D6", `${pprRealizationPercent}%`);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "E6", exploitationBranchFactTime);
  createCellWithBorderAndCenterAlignmentAndWrap(pprRealizationSheet, "F6", `${pprRealizationExploitationPercent}%`);

  return pprRealizationSheet;
}
