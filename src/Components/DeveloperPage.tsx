import React from "react";
import apiFetch from "../healper/ApiFetch";

export default function DeveloperPage() {
  React.useEffect(() => {
    apiFetch.getData("http://localhost:5000/api/ppr/all", console.log);
  });
  return (
    <div>
      <h2>Страница для разработчика</h2>
    </div>
  );
}
