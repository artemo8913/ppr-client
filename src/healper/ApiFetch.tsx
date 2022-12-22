class ApiFetch {
  async getData(
    url: string,
    callback: Function,
    method: string,
    data?: object | Array<any>
  ) {
    await fetch(url, { body: JSON.stringify(data), method })
      .then((data) => data.json())
      .then((json) => callback(JSON.stringify(json)))
      .catch((error) => console.log(error));
  }
}
export default new ApiFetch();
