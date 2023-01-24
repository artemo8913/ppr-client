import apiFetch from "../../healper/ApiFetch";

export default function ButtonForApiTest(props: {
  url: string;
  callback: Function;
  method: "get" | "post" | "put" | "delete";
}) {
  const { url, callback, method } = props;
  return (
    <button onClick={() => apiFetch.getData(url, 'stringify' , callback, method)}>
      {method + " " + url}
    </button>
  );
}
