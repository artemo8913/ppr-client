class ApiFetch {
  async getData(url: string, callback: Function, data?: object | Array<any>) {
    await fetch(url, { body: JSON.stringify(data) })
      .then((data) => data.json())
      .then((json) => callback(json))
      .catch((error) => console.log(error));
  }
}
export default new ApiFetch();
