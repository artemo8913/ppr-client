import React from "react";
import apiFetch from "../healper/ApiFetch";

const baseUrl = "http://localhost:5000/api";

export default function DeveloperPage() {
  const [workApiResult, setWorkApiResult] =
    React.useState<string>("workApiResult");
  const [pprApiResult, setPprApiResult] =
    React.useState<string>("pprApiResult");
  return (
    <div>
      <h2>Страница для разработчика</h2>
      <fieldset>
        <legend>API запросы по работам</legend>
        <button
          onClick={() =>
            apiFetch.getData(baseUrl + "/work/all", setWorkApiResult, "get")
          }
        >
          get("/all", getAllWorkData)
        </button>
        {workApiResult}
      </fieldset>
      <fieldset>
        <legend>API запросы по ППРам</legend>
        <button
          onClick={() =>
            apiFetch.getData(baseUrl + "/ppr/all", setPprApiResult, "get")
          }
        >
          get("/all", getAllPlans)
        </button><br />
        <button
          onClick={() =>
            apiFetch.getData(baseUrl + "/ppr/", setPprApiResult, "get", {
              nameOfPprTable: "pprechk9",
            })
          }
        >
          get("/", getYearPlan)
        </button>
        {pprApiResult}
      </fieldset>
    </div>
  );
}
