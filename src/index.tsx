import "./style.css";
import ReacCellOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/store";

import App from "./App";

//@ts-ignore
const root = ReacCellOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />    
  </Provider>
);
