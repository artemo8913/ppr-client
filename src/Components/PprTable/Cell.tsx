import styled from "styled-components";
import { ICell } from "../../Interface";
import { useDispatch } from "react-redux";
import { changeCellData } from "../../Redux/slice/pprDataSlice";
import settings from "../../settings";
//в классы переписать цвет фона для плана, вертикальный текст, editable
const CellStyled = styled.td<{ bgType: string; vText: boolean; editable: boolean; widthPercent?: number }>`
  background-color: ${(props) => (props.bgType ? settings.colors[props.bgType] : "")};
  ${(props) =>
    props.vText && !props.editable
      ? `
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        `
      : ``}
  width: ${(props) => (props.widthPercent ? `${props.widthPercent}%` : "unset")};
  max-height: 500px;
  min-height: 100px;
  word-break: normal;
  text-align: center;
  border: 1px solid black;
  cursor: default;
  &:hover {
    box-shadow: inset 0px 0px 10px #ff00dd;
  }
  &.green {
    box-shadow: inset 0px 0px 10px #00ff0d;
  }
`;
const ConteinerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  min-height: 100px;
  & * {
    flex: 1 0 auto;
  }
`;
const TextAreaStyled = styled.textarea<{ verticalText: boolean; cols: number | undefined }>`
  width: ${(props) => (props.cols ? "unset" : "100%")};
  text-align: center;
  resize: none;
  border: none;
  background: none;
  ${(props) =>
    props.verticalText
      ? `
        transform: translate(0%, 0%) rotate(-90deg);
        `
      : ``}
`;

function setBgType(type: string | undefined): string {
  let result = "";
  if (!type) return "";
  if (type.endsWith("jan") || type.endsWith("feb") || type.endsWith("mar")) result = "firstQuarter";
  else if (type.endsWith("apr") || type.endsWith("may") || type.endsWith("june")) result = "secondQuarter";
  else if (type.endsWith("july") || type.endsWith("aug") || type.endsWith("sept")) result = "thirdQuarter";
  else if (type.endsWith("oct") || type.endsWith("nov") || type.endsWith("dec")) result = "fourthQuarter";
  if (type.startsWith("fact")) result += "Transparent";
  return result;
}

function validateTextareaInput(text: string): boolean {
  return !/[^а-яa-z0-9- _,]/i.test(text);
}

export default function Cell(props: ICell) {
  const {
    rowId,
    type,
    children,
    textareaRows = 1,
    textareaCols,
    vText = false,
    editable = false,
    dropdown,
    colSpan,
    rowSpan,
    widthPercent,
  } = props;

  const dispatch = useDispatch();
  const bgType = setBgType(type);

  return (
    <CellStyled widthPercent={widthPercent} editable={editable} vText={vText} colSpan={colSpan} rowSpan={rowSpan} bgType={bgType}>
      {editable ? (
        <ConteinerStyled>
          <TextAreaStyled
            cols={textareaCols}
            rows={textareaRows}
            verticalText={vText}
            value={children}
            onChange={(e) => {
              if (validateTextareaInput(e.target.value)) {
                dispatch(changeCellData({ id: rowId || "none", newValue: e.target.value, category: type ? type.split(" ") : ["none"] }));
              }
            }}
          />
        </ConteinerStyled>
      ) : (
        children
      )}
    </CellStyled>
  );
}
