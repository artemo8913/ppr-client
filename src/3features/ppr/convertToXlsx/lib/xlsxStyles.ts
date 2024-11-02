import ExcelJS from "exceljs";

export const BLACK_BORDER: Partial<ExcelJS.Borders> = {
  bottom: { color: { argb: "FF000000" }, style: "thin" },
  left: { color: { argb: "FF000000" }, style: "thin" },
  right: { color: { argb: "FF000000" }, style: "thin" },
  top: { color: { argb: "FF000000" }, style: "thin" },
};

export const VERTICAL_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  wrapText: true,
  textRotation: 90,
  horizontal: "center",
};
export const CENTER_ALIGNMENT: Partial<ExcelJS.Alignment> = { wrapText: true, horizontal: "center" };
