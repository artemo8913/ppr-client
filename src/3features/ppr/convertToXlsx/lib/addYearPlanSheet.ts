import ExcelJS from "exceljs";

import { TIME_PERIODS, TTimePeriod, translateRuTimePeriod } from "@/1shared/lib/date";
import {
  IPpr,
  IPprData,
  IPprMeta,
  PPR_DATA_FIELDS,
  PLAN_TIME_FIELDS,
  PLAN_WORK_FIELDS,
  IBranchDefaultMeta,
  translateRuPprFieldName,
  PPR_DATA_BASIC_FIELDS,
  checkIsWorkOrTimeField,
  translateRuPprBranchName,
  TPprDataFieldsTotalValues,
} from "@/2entities/ppr";

import { BOLD, setBgColorXlsx, BLACK_BORDER_FULL, CENTER_ALIGNMENT_WITH_WRAP, VERTICAL_ALIGNMENT } from "./xlsxStyles";

const MAX_COLUMNS_COUNT = 76;

const TIME_PERIOD_COL_SPAN = 5;

const START_COLUMNS_INDEX = 6;

const DATA_START_ROW_INDEX = 3;

const FIRST_ROW_INDEX = 1;

const SECOND_ROW_INDEX = 2;

const THIRD_ROW_INDEX = 3;

const MIN_COL_WIDTH = 3;

const HEADER_HEIGHT = 250;

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
  last_maintenance_year: 15,
  norm_of_time: 3,
  norm_of_time_document: 10,
  measure: 10,
  unity: 3,
};

function checkIsFieldVertical(field: keyof IPprData) {
  return (
    checkIsWorkOrTimeField(field) ||
    field === "total_count" ||
    field === "entry_year" ||
    field === "periodicity_normal" ||
    field === "line_class" ||
    field === "unity" ||
    field === "norm_of_time"
  );
}

function getPlanFactFields(period: TTimePeriod) {
  return [
    `${period}_plan_work`,
    `${period}_plan_time`,
    `${period}_fact_work`,
    `${period}_fact_norm_time`,
    `${period}_fact_time`,
  ];
}

interface IAddYearPlanSheetArgs {
  workbook: ExcelJS.Workbook;
  ppr: IPpr;
  pprMeta: IPprMeta;
  sheetName?: string;
  sheetOptions?: Partial<ExcelJS.AddWorksheetOptions>;
  pprDataView?: "original" | "final";
}

export function addYearPlanSheet({
  ppr,
  workbook,
  pprMeta,
  sheetName,
  sheetOptions,
  pprDataView = "final",
}: IAddYearPlanSheetArgs): ExcelJS.Worksheet {
  const yearPlanSheet = workbook.addWorksheet(sheetName, sheetOptions);

  const { branchesMeta, branchesAndSubbrunchesOrder, totalValues } = pprMeta;

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

  // TODO: переписать на обычный цикл for(){}; Мне кажется он более читабелен будет, восприниматься также будет лучше. colIndex будет не нужен???
  // TODO: перенести стилизацию ячеек в соответствующие функции в файл xlsxStyles

  // Счетчик столбцов (для построения шапки таблицы)
  let colIndex = START_COLUMNS_INDEX;

  // Ячейки шапки таблицы до временных периодов
  PPR_DATA_BASIC_FIELDS.forEach((field) => {
    // Объединить ячейки
    yearPlanSheet.mergeCells(FIRST_ROW_INDEX, colIndex, SECOND_ROW_INDEX, colIndex);

    const cell = yearPlanSheet.getCell(FIRST_ROW_INDEX, colIndex);
    // Стилизация ячейки
    cell.value = translateRuPprFieldName(field);
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
    getPlanFactFields(period).map((field) => {
      const planFactCell = yearPlanSheet.getCell(SECOND_ROW_INDEX, colIndex);
      planFactCell.value = translateRuPprFieldName(field);
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

  // Строка с нумерацией столбцов
  for (let index = 1; index <= MAX_COLUMNS_COUNT; index++) {
    const cell = yearPlanSheet.getCell(THIRD_ROW_INDEX, START_COLUMNS_INDEX + index - 1);

    cell.value = index;
    cell.border = BLACK_BORDER_FULL;
    cell.alignment = { horizontal: "center" };
  }

  let lastRowIndex = DATA_START_ROW_INDEX;

  function createBranchRow(branchOrder: string, branchName: string) {
    yearPlanSheet.mergeCells(
      lastRowIndex,
      START_COLUMNS_INDEX,
      lastRowIndex,
      START_COLUMNS_INDEX + MAX_COLUMNS_COUNT - 1
    );

    const branchTitleCell = yearPlanSheet.getCell(lastRowIndex, START_COLUMNS_INDEX);

    // Стилизация ячеек разделов и подразделов
    branchTitleCell.value = `${branchOrder} ${translateRuPprBranchName(branchName)}`;
    branchTitleCell.border = BLACK_BORDER_FULL;
    branchTitleCell.alignment = { horizontal: "left" };
    branchTitleCell.style.font = BOLD;

    lastRowIndex++;
  }

  function createTotalRow(branchDefault: Partial<IBranchDefaultMeta>, text: string) {
    const row = yearPlanSheet.getRow(lastRowIndex);

    PPR_DATA_FIELDS.forEach((field) => {
      const cell = row.getCell(field);

      if (field === "name") {
        cell.value = text;
      } else if (branchDefault?.total && field in branchDefault?.total[pprDataView]) {
        cell.value = branchDefault?.total[pprDataView][field as keyof TPprDataFieldsTotalValues];
      }

      // Стилизация ячеек данных
      cell.border = BLACK_BORDER_FULL;
      cell.style.font = BOLD;

      if (checkIsFieldVertical(field)) {
        cell.alignment = VERTICAL_ALIGNMENT;
      }
    });

    lastRowIndex++;
  }

  const dataCells: ExcelJS.Cell[] = [];

  // Добавить данные в таблицу
  ppr.data.map((pprData, index) => {
    // Создание ячеек-заголовков разделов и подразделов, а также итоговых значений
    if (pprData.id in branchesAndSubbrunchesOrder) {
      lastRowIndex++;

      const { branch, subbranch } = branchesAndSubbrunchesOrder[pprData.id];

      if (subbranch.prev) {
        createTotalRow(subbranch.prev, `Итого по пункту ${subbranch.prev.orderIndex}`);
      }

      if (branch?.prev) {
        createTotalRow(branch.prev, `Итого по разделу ${branch.prev.orderIndex}`);
      }

      if (branch) {
        createBranchRow(branch.orderIndex, branch.name);
      }

      createBranchRow(subbranch.orderIndex, subbranch.name);
    }

    const finalData: any = { ...pprData };

    if (pprDataView === "final") {
      PLAN_WORK_FIELDS.map((field) => (finalData[field] = pprData[field].final));
      PLAN_TIME_FIELDS.map((field) => (finalData[field] = pprData[field].final));
    } else {
      PLAN_WORK_FIELDS.map((field) => (finalData[field] = pprData[field].original));
      PLAN_TIME_FIELDS.map((field) => (finalData[field] = pprData[field].original));
    }

    const row = yearPlanSheet.addRow(finalData);

    row.getCell("name").value = {
      richText: [
        { text: `${pprMeta.worksOrderForRowSpan[pprData.id]} ` },
        { text: pprData.name },
        {
          text: pprData.note ? `\n(прим. ${pprData.note})` : "",
          font: { bold: true, name: "Times New Roman", size: 10 },
        },
      ],
    };

    dataCells.push(row.getCell("name"));

    lastRowIndex = row.number;

    // Стилизация ячеек данных
    PPR_DATA_FIELDS.forEach((field) => {
      const cell = row.getCell(field);

      cell.border = BLACK_BORDER_FULL;
      cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };

      cell.fill = {
        fgColor: { argb: setBgColorXlsx(field) },
        type: "pattern",
        pattern: "solid",
      };

      if (checkIsFieldVertical(field)) {
        cell.alignment = VERTICAL_ALIGNMENT;
      }

      if (checkIsWorkOrTimeField(field) && Number(cell.value) === 0) {
        cell.value = "";
      }
    });

    // Если строка последняя, то добавить итого по последним пункту и разделу
    if (index === ppr?.data.length - 1) {
      lastRowIndex++;
      const lastBranch = branchesMeta.slice(-1)[0];
      const lastSubbranch = lastBranch.subbranches.slice(-1)[0];
      createTotalRow(lastSubbranch, `Итого по пункту ${lastSubbranch.orderIndex}`);
      createTotalRow(lastBranch, `Итого по разделу ${lastBranch.orderIndex}`);
      createTotalRow(
        { total: { final: totalValues.final.works, original: totalValues.original.works } },
        "Итого по разделам 1-3"
      );
    }
  });

  dataCells.forEach((cell, index) => {
    const rowNumber = Number(cell.row);

    const rowDiff = pprMeta.worksRowSpan[index] - 1;

    if (rowDiff > 0) {
      yearPlanSheet.mergeCells(`F${rowNumber}:F${rowNumber + rowDiff}`);
    }
  });

  return yearPlanSheet;
}
