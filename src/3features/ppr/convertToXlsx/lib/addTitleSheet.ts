import ExcelJS from "exceljs";
import { Session } from "next-auth";

import { IPpr } from "@/2entities/ppr";

import { BLACK_BORDER_BOTTOM, BOLD, CENTER_ALIGNMENT, createHeaderCell } from "./xlsxStyles";

interface IAddTitleSheetArgs {
  workbook: ExcelJS.Workbook;
  ppr?: IPpr;
  session?: Session | null;
  sheetName?: string;
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
}

export function addTitleSheet({
  workbook,
  ppr,
  session,
  sheetName,
  sheetOptions,
}: IAddTitleSheetArgs): ExcelJS.Worksheet {
  const titleSheet = workbook.addWorksheet(sheetName, sheetOptions);

  // верхний правый угол
  titleSheet.mergeCells("F1:J1");
  titleSheet.getCell("F1").value = "Форма ЭУ-132";
  titleSheet.getCell("F2").value = 'УТВЕРЖДЕНА распоряжением ОАО "РЖД"';
  titleSheet.getCell("F3").value = "от 16.09.2024 № 2255/р";

  // Наименование дирекции
  titleSheet.getCell("B7").value = "Дирекция по энергообеспечению";
  titleSheet.mergeCells("B8:D8");
  titleSheet.getCell("B8").value = session?.user.directionShortName;
  titleSheet.getCell("B8").border = BLACK_BORDER_BOTTOM;

  // Наименование дистанции
  titleSheet.getCell("B9").value = "Дистанция электроснабжения";
  titleSheet.mergeCells("B10:D10");
  titleSheet.getCell("B10").value = session?.user.distanceShortName;
  titleSheet.getCell("B10").border = BLACK_BORDER_BOTTOM;

  // Наименование подразделения
  titleSheet.getCell("B11").value = "Подразделение";
  titleSheet.mergeCells("B12:D12");
  titleSheet.getCell("B12").value = session?.user.subdivisionShortName;
  titleSheet.getCell("B12").border = BLACK_BORDER_BOTTOM;

  // Графа "СОГЛАСОВАНО"
  titleSheet.getCell("B15").value = "СОГЛАСОВАНО";
  titleSheet.mergeCells("B16:D16");
  titleSheet.getCell("B16").border = BLACK_BORDER_BOTTOM;
  titleSheet.mergeCells("B17:D17");
  titleSheet.getCell("B17").border = BLACK_BORDER_BOTTOM;
  titleSheet.getCell("B18").value = '"____"_____________ 20 ___ г.';

  // Графа "УТВЕРЖДАЮ"
  titleSheet.getCell("G15").value = "УТВЕРЖДАЮ";
  titleSheet.mergeCells("G16:I16");
  titleSheet.getCell("G16").border = BLACK_BORDER_BOTTOM;
  titleSheet.mergeCells("G17:I17");
  titleSheet.getCell("G17").border = BLACK_BORDER_BOTTOM;
  titleSheet.getCell("G18").value = '"____"_____________ 20 ___ г.';

  // Заголовок
  createHeaderCell(titleSheet, "E20", "КАЛЕНДАРНЫЙ ПЛАН");
  createHeaderCell(titleSheet, "E21", "работ по техническому содержанию");
  createHeaderCell(titleSheet, "E22", "устройств электрификации и электроснабжения");
  createHeaderCell(titleSheet, "D23", "на");
  const yearCell = createHeaderCell(titleSheet, "E23", `${ppr?.year}`);
  yearCell.border = BLACK_BORDER_BOTTOM;
  createHeaderCell(titleSheet, "F23", "год");

  return titleSheet;
}
