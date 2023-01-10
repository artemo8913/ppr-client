import { nanoid } from "nanoid";
import React, { ChangeEventHandler } from "react";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addData, removeData, toggleStatus, toggleFulfullingMounth } from "../../Redux/slice/pprDataSlice";
import { toggleHiddenColumns, toggleUniteCells, toggleEditableState } from "../../Redux/slice/pprUISlice";
import { pprStatuses, pprHidingColumnsStates, fullMounthsList } from "../../settings";

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
  const changeFulfullingMounth = (mounth: string) => dispatch(toggleFulfullingMounth({ mounth }));
  const changeHiddenColumns = (hiddenColumnsState: string) => dispatch(toggleHiddenColumns({ hiddenColumnsState }));
  const changeUnitCellsProperty = (shouldUnit: boolean) => dispatch(toggleUniteCells({ shouldUnit }));
  const updateEditableState = (status: string, fulfullingMounth: string) => dispatch(toggleEditableState({status, fulfullingMounth}));

  return (
    <div>
      <button onClick={() => addNewRow()}>Добавить строчечку</button>
      <button onClick={() => removeRow()}>
        Удалить строчечку с id=
        <input style={{ width: "30px" }} value={id} onChange={(e) => setId(e.target.value)} />{" "}
      </button>
      <span>Статус: {pprDataState.status}</span>
      <Select
        handleChange={(e) => {
          changePprStatus(e.target.value);
          updateEditableState(e.target.value, pprDataState.fulfullingMounth);
        }}
        list={pprStatuses}
      ></Select>
      <span>Период ввода данных: {pprDataState.fulfullingMounth}</span>
      <Select handleChange={(e) => changeFulfullingMounth(e.target.value)} list={fullMounthsList}></Select>
      <span>Скрыть столбы: {pprUIState.hidden}</span>
      <Select handleChange={(e) => changeHiddenColumns(e.target.value)} list={pprHidingColumnsStates}></Select>
      <span>Объединять ячейки? {pprUIState.uniteCells.toString()}</span>
      <input type="checkbox" defaultChecked={pprUIState.uniteCells} onChange={() => changeUnitCellsProperty(!pprUIState.uniteCells)} />
    </div>
  );
}
