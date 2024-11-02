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

export const VERTICAL_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  wrapText: true,
  textRotation: 90,
  horizontal: "center",
};
export const CENTER_ALIGNMENT_WITH_WRAP: Partial<ExcelJS.Alignment> = { wrapText: true, horizontal: "center" };

export const CENTER_ALIGNMENT: Partial<ExcelJS.Alignment> = { horizontal: "center" };
