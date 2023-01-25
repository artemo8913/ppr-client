class ApiFetch {
  async exchangeData(
    url: string,
    resultType: "stringify" | "parse",
    callback: Function,
    method: "get" | "post" | "put" | "delete",
    data?: object | Array<any>
  ) {
    console.log(data)
    await fetch(url, {
      body: JSON.stringify(data),
      method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((json) => {
        if (resultType === "stringify") {
          callback(JSON.stringify(json, null, " "));
        } else if (resultType === "parse") {
          callback(JSON.parse(JSON.stringify(json)));
        }
        console.log(JSON.stringify(json, null, " "));
      })
      .catch((error) => console.log(error));
  }
}
export default new ApiFetch();
