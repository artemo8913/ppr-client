import React from "react";
import Button from "./ButtonForApiTest";

const baseUrl = "http://localhost:5000/api";

export default function DeveloperPage() {
  const [workApiResult, setWorkApiResult] = React.useState("work");
  const [workApiSettings, setWorkApiSettings] = React.useState({
    id: 1,
  });
  const [pprApiResult, setPprApiResult] = React.useState("ppr");
  const [pprApiSettings, setPprApiSettings] = React.useState({
    id: 1,
  });
  const [divisionsApiResult, setDivisionsApiResult] = React.useState("div");
  const [divisionsApiSettings, setDivisionsApiSettings] = React.useState({
    divisionTableName: "directions",
    id: 1,
  });
  function changeWorkApiSettings(divisionsApi: { id?: number }) {
    setWorkApiSettings((prev) => {
      return {
        ...prev,
        ...divisionsApi,
      };
    });
  }
  function changePprApiSettings(divisionsApi: { id?: number }) {
    setPprApiSettings((prev) => {
      return {
        ...prev,
        ...divisionsApi,
      };
    });
  }
  function changeDivisionsApiSettings(settings: {
    divisionTableName?: string;
    id?: number;
  }) {
    setDivisionsApiSettings((prevSettings) => {
      return {
        ...prevSettings,
        ...settings,
      };
    });
  }

  return (
    <div>
      <h2>Страница для разработчика</h2>
      <fieldset>
        <legend>API запросы по работам</legend>
        <input
          onChange={(e) => changeWorkApiSettings({ id: Number(e.target.value) })}
          value={workApiSettings.id}
          type="number"
        />
        <Button
          url={baseUrl + "/work"}
          callback={setWorkApiResult}
          method="get"
        ></Button>
        <Button
          url={baseUrl + `/work/${workApiSettings.id}`}
          callback={setWorkApiResult}
          method="get"
        ></Button>
        <br />
        {workApiResult}
      </fieldset>
      <fieldset>
        <legend>API запросы по ППРам</legend>
        <input
          onChange={(e) => changePprApiSettings({ id: Number(e.target.value) })}
          value={pprApiSettings.id}
          type="number"
        />
        <Button
          url={baseUrl + "/ppr/"}
          callback={setPprApiResult}
          method="get"
        ></Button>
        <Button
          url={baseUrl + `/ppr/${pprApiSettings.id}`}
          callback={setPprApiResult}
          method="get"
        ></Button>
        <br />
        {pprApiResult}
      </fieldset>
      <fieldset>
        <legend>API запросы по подразделениям</legend>
        <select
          onChange={(e) =>
            changeDivisionsApiSettings({
              divisionTableName: e.target.value,
            })
          }
        >
          <option>directions</option>
          <option>distances</option>
          <option>subdivisions</option>
        </select>
        <input
          onChange={(e) =>
            changeDivisionsApiSettings({ id: Number(e.target.value) })
          }
          value={divisionsApiSettings.id}
          type="number"
        />
        <Button
          url={baseUrl + "/divisions/"}
          callback={setDivisionsApiResult}
          method="get"
        ></Button>
        <Button
          url={
            baseUrl +
            `/divisions/${divisionsApiSettings.divisionTableName}/${divisionsApiSettings.id}`
          }
          callback={setDivisionsApiResult}
          method="get"
        ></Button>
        <br />
        {divisionsApiResult}
      </fieldset>
    </div>
  );
}
