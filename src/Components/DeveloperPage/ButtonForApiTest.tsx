import apiFetch from "../../healper/ApiFetch";

export default function ButtonForApiTest(props: {
  url: string;
  callback: Function;
  method: string;
}) {
  const { url, callback, method } = props;
  return (
    <button onClick={() => apiFetch.getData(url, callback, method)}>
      {method + " " + url}
    </button>
  );
}
