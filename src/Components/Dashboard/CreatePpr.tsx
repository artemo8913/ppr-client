import styled from "styled-components";
import { Typography, Button } from '@mui/material';

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
