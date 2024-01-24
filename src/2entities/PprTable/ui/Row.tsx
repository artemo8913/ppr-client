import { Fragment } from "react";
import { IRow } from "../model/pprSchema";
import Cell from "./Cell";
import settings from "../model/pprSettings";

export default function Row(props: IRow) {
  const {
    editableColumnsList,
    workAndTimeColumnsList,
    infoColumnsList,
    monthList,
    data,
    sectionVSpan = 1,
    subsectionVSpan = 1,
  } = props;
  const colSett = settings.pprColumnSettings;

  const columnsInformationData = infoColumnsList.map((column) => {
    if (workAndTimeColumnsList.indexOf(column) === -1) {
      const vSpan = column === "section" ? sectionVSpan : column === "subsection_first" ? subsectionVSpan : 1;
      const vText = !!colSett[column].vText;
      const editable = editableColumnsList.indexOf(column) !== -1;
      const textareaRows = vText ? 1 : colSett.textareaRows;
      const textareaCols = vText ? colSett.textareaCols : null;
      return (
        <Cell
          type="textarea"
          textAreaRows={textareaRows}
          vText={vText}
          key={column}
          rowSpan={vSpan}
          //@ts-ignore
          value={data[column]}
        />
      );
    }
  });
  const planData = monthList.map((timePeriod) => {
    const workDataEl = workAndTimeColumnsList.map((column) => {
      const vText = !!colSett[column].vText;
      const editableCol = editableColumnsList.indexOf(column) !== -1;
      const editableTimePeriod = editableColumnsList.indexOf(timePeriod) !== -1;
      const editable = editableCol && editableTimePeriod;
      const textareaRows = vText ? 1 : colSett.textareaRows;
      const textareaCols = vText ? colSett.textareaCols : null;
      return (
        <Fragment key={`${column} ${timePeriod}`}>
          <Cell
            textAreaRows={textareaRows}
            vText={vText}
            type="textarea"
            /**@ts-ignore*/
            value={2}
          />
        </Fragment>
      );
    });
    return <Fragment key={timePeriod}>{workDataEl}</Fragment>;
  });

  return (
    <tr>
      {columnsInformationData}
      {planData}
    </tr>
  );
}
