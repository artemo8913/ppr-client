import { nanoid } from "nanoid";
import React, { ChangeEventHandler } from "react";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addData, removeData, toggleStatus, toggleFulfullingMonth } from "../../Redux/slice/pprDataSlice";
import { toggleHiddenColumns, toggleUniteCells, toggleEditableState } from "../../Redux/slice/pprUISlice";
import { pprStatuses, pprHidingColumnsStates, fullMonthsList } from "../../settings";

function Select(props: { list: Array<string>; handleChange: ChangeEventHandler<HTMLSelectElement> }) {
  const options = props.list.map((option) => <option>{option}</option>);
  return <select onChange={props.handleChange}>{options}</select>;
}

export default function PprStateSandbox() {
  const [id, setId] = React.useState("1");
  const pprUIState = useSelector((state: RootState) => state.pprUI);
  const pprDataState = useSelector((state: RootState) => state.pprData);
  const dispatch = useDispatch();
  const addNewRow = () => {
    const newId = nanoid();
    if (newId) {
      dispatch(addData({ id: newId }));
    }
  };
  const removeRow = () => dispatch(removeData({ id }));
  const changePprStatus = (status: string) => dispatch(toggleStatus({ status }));
  const changeFulfullingMonth = (month: string) => dispatch(toggleFulfullingMonth({ month }));
  const changeHiddenColumns = (hiddenColumnsState: string) => dispatch(toggleHiddenColumns({ hiddenColumnsState }));
  const changeUnitCellsProperty = (shouldUnit: boolean) => dispatch(toggleUniteCells({ shouldUnit }));
  const updateEditableState = (status: string, fulfullingMonth: string) => dispatch(toggleEditableState({status, fulfullingMonth}));

  return (
    <div style={{padding: '10px'}}>
      <button onClick={() => addNewRow()}>Добавить строчечку</button>
      <button onClick={() => removeRow()}>
        Удалить строчечку с id=
        <input style={{ width: "30px" }} value={id} onChange={(e) => setId(e.target.value)} />{" "}
      </button>
      <span>Статус: {pprDataState.status}</span>
      <Select
        handleChange={(e) => {
          changePprStatus(e.target.value);
          updateEditableState(e.target.value, pprDataState.fulfullingMonth);
        }}
        list={pprStatuses}
      ></Select>
      <span>Период ввода данных: {pprDataState.fulfullingMonth}</span>
      <Select handleChange={(e) => changeFulfullingMonth(e.target.value)} list={fullMonthsList}></Select>
      <span>Скрыть столбы: {pprUIState.hidden}</span>
      <Select handleChange={(e) => changeHiddenColumns(e.target.value)} list={pprHidingColumnsStates}></Select>
      <span>Объединять ячейки? {pprUIState.uniteCells.toString()}</span>
      <input type="checkbox" defaultChecked={pprUIState.uniteCells} onChange={() => changeUnitCellsProperty(!pprUIState.uniteCells)} />
    </div>
  );
}
