import styled from "styled-components";
import { Button } from "@mui/material";
import apiFetch from "../../healper/ApiFetch";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const ListItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  align-items: center;
  & span {
    flex: 1 1 auto;
  }
  & button {
  }
`;

export default function CreatePpr() {
  const user = useSelector((store: RootState) => store.user);
  const status = "creating";
  const [newPprData, setNewPprData] = React.useState<{
    prototypePlanId: string;
    year: string;
  }>();
  const dataForCreating = {
    prototypePlanId: newPprData?.prototypePlanId,
    year: newPprData?.year,
    id_subdivision: user.id_subdivision,
    id_distance: user.id_distance,
    id_direction: user.id_direction,
    status: status,
  };
  function createNewPpr() {
    apiFetch.getData("http://localhost:5000/api/ppr", "stringify", console.log, "post", dataForCreating);
  }
  return (
    <div>
      <ListItem>
        <span>Год</span>
        <select>
          <option>2022</option>
          <option>2023</option>
        </select>
      </ListItem>
      <ListItem>
        <span>Прототип (шаблон) ППР</span>
        <select>
          <option>proto1</option>
          <option>proto2</option>
        </select>
      </ListItem>
      <Button variant="outlined">Создать</Button>
    </div>
  );
}
