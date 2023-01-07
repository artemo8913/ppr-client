import { Fragment } from "react";
import styled from "styled-components";
import { IMounthData, IRow, IRowData } from "../../Interface";
import Cell from "./Cell";
import settings from "../../settings";

const StyledRow = styled.tr`
  &:hover {
    box-shadow: inset 0px 0px 10px #00ff1e;
  }
`;

export default function Row(props: IRow) {
  const { editableColumnsList, workAndTimeColumnsList, infoColumnsList, mounthList, data, sectionVSpan = 1, subsectionVSpan = 1 } = props;
  const { id } = data;
  const colSett = settings.pprColumnSettings;

  const columnsInformationData = infoColumnsList.map((column) => {
    //@ts-ignore
    if (typeof data[column] === "string" || typeof data[column] === "number") {
      const vSpan = column === "section" ? sectionVSpan : column === "subsection" ? subsectionVSpan : 1;
      const vText = !!colSett[column].vText;
      const editable = editableColumnsList.indexOf(column) !== -1;
      const textareaRows = vText ? 1 : colSett.textareaRows;
      const textareaCols = vText ? colSett.textareaCols : null;
      return (
        <Cell
          textareaRows={textareaRows}
          textareaCols={textareaCols}
          editable={editable}
          rowId={id}
          type={column}
          vText={vText}
          key={column}
          rowSpan={vSpan}
        >
          {/*@ts-ignore*/}
          {data[column]}
        </Cell>
      );
    }
  });
  const planData = mounthList.map((timePeriod) => {
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
            textareaRows={textareaRows}
            textareaCols={textareaCols}
            editable={editable}
            vText={vText}
            rowId={id}
            type={`${column} ${timePeriod}`}
          >
            {/*@ts-ignore*/}
            {data[column][timePeriod]}
          </Cell>
        </Fragment>
      );
    });
    return <Fragment key={timePeriod}>{workDataEl}</Fragment>;
  });

  return (
    <StyledRow>
      {columnsInformationData}
      {planData}
    </StyledRow>
  );
}
