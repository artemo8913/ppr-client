import ExcelJS from "exceljs";

export const BLACK_BORDER_FULL: Partial<ExcelJS.Borders> = {
  bottom: { color: { argb: "FF000000" }, style: "thin" },
  left: { color: { argb: "FF000000" }, style: "thin" },
  right: { color: { argb: "FF000000" }, style: "thin" },
  top: { color: { argb: "FF000000" }, style: "thin" },
};

export const BLACK_BORDER_BOTTOM: Partial<ExcelJS.Borders> = {
  bottom: { color: { argb: "FF000000" }, style: "thin" },
};

export const BOLD: Partial<ExcelJS.Font> = { bold: true };

export const VERTICAL_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  wrapText: true,
  textRotation: 90,
  horizontal: "center",
};
export const CENTER_ALIGNMENT_WITH_WRAP: Partial<ExcelJS.Alignment> = { wrapText: true, horizontal: "center" };

export const CENTER_ALIGNMENT: Partial<ExcelJS.Alignment> = { horizontal: "center" };

export function createHeaderCell(sheet: ExcelJS.Worksheet, cellAdress: string, text?: string): ExcelJS.Cell {
  const cell = sheet.getCell(cellAdress);
  cell.value = text;
  cell.font = BOLD;
  cell.alignment = CENTER_ALIGNMENT;

  return cell;
}

export function createCellWithBorderAndCenterAlignmentAndWrap(
  sheet: ExcelJS.Worksheet,
  cellAdress: string,
  text?: string | number
): ExcelJS.Cell {
  const cell = sheet.getCell(cellAdress);
  cell.value = text;
  cell.border = BLACK_BORDER_FULL;
  cell.alignment = CENTER_ALIGNMENT_WITH_WRAP;

  return cell;
}

export function setBgColorXlsx(field: string): string | undefined {
  // 1 квартал
  if (field.startsWith("jan_plan") || field.startsWith("feb_plan") || field.startsWith("mar_plan")) {
    return "FF91b4eb";
  } else if (field.startsWith("jan_fact") || field.startsWith("feb_fact") || field.startsWith("mar_fact")) {
    return "FFc5d5ed";
  }
  // 2 квартал
  if (field.startsWith("apr_plan") || field.startsWith("may_plan") || field.startsWith("june_plan")) {
    return "FF91ebb4";
  } else if (field.startsWith("apr_fact") || field.startsWith("may_fact") || field.startsWith("june_fact")) {
    return "FFc5edd5";
  }
  // 3 квартал
  if (field.startsWith("july_plan") || field.startsWith("aug_plan") || field.startsWith("sept_plan")) {
    return "FF98ebdf";
  } else if (field.startsWith("july_fact") || field.startsWith("aug_fact") || field.startsWith("sept_fact")) {
    return "FFbae6df";
  }
  // 4 квартал
  if (field.startsWith("oct_plan") || field.startsWith("nov_plan") || field.startsWith("dec_plan")) {
    return "FFebc298";
  } else if (field.startsWith("oct_fact") || field.startsWith("nov_fact") || field.startsWith("dec_fact")) {
    return "FFe6d3ba";
  }
}
