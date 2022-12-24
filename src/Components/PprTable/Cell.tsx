import styled from "styled-components";
import { ICell } from "../../Interface";
import { useDispatch } from "react-redux";
import { change } from "../../Redux/slice/pprSlice";
import theme from "../../theme";

const CellStyled = styled.td<{ bgType: string, verticalText: boolean }>`
    text-align: center;
    border: 1px solid black;
    background-color: ${props => props.bgType ? theme.colors[props.bgType] : ''};
    cursor: default;
    &:hover{
        box-shadow: inset 0px 0px 10px #ff00dd;
    }
    ${props => props.verticalText ? `
        writing-mode: vertical-lr;
        ` : ``}
`;

const TextAreaStyled = styled.textarea <{ verticalText: boolean }>`
    resize: none;
    border: none;
    background: none;
    ${props => props.verticalText ? `
        ` : ``}
`;

function setBgType(type: string | undefined): string {
    let result = '';
    if (!type) return '';
    if (type.endsWith('jan') || type.endsWith('feb') || type.endsWith('mar')) result = 'firstQuarter';
    else if (type.endsWith('apr') || type.endsWith('may') || type.endsWith('june')) result = 'secondQuarter';
    else if (type.endsWith('july') || type.endsWith('aug') || type.endsWith('sept')) result = 'thirdQuarter';
    else if (type.endsWith('oct') || type.endsWith('nov') || type.endsWith('dec')) result = 'fourthQuarter';
    if (type.startsWith('fact')) result += 'Transparent';
    return result;
}

export default function Cell(props: ICell) {
    const {
        id,
        type,
        children,
        verticalText = false,
        editable,
        dropdown,
        colSpan,
        rowSpan
    } = props;
    const dispatch = useDispatch();
    const bgType = setBgType(type);

    return (
        <CellStyled verticalText={verticalText} colSpan={colSpan} rowSpan={rowSpan} bgType={bgType}>
            {editable ?
                <TextAreaStyled
                    verticalText={verticalText}
                    value={children}
                    onChange={(e) => dispatch(change({ id: id || 'none', newValue: e.target.value, category: type ? type.split(' ') : ['none'] }))}
                /> :
                children}
        </CellStyled>
    )
}