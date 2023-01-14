class ApiFetch {
  async getData(url: string, resultType: "stringify" | "parse", callback: Function, method: string, data?: object | Array<any>) {
    await fetch(url, { body: JSON.stringify(data), method })
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
