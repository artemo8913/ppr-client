import ReacCellOM from "react-dom/client";
import App from "./App";
import DeveloperPage from "./Components/DeveloperPage";
import "./style.css";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//@ts-ignore
const root = ReacCellOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="/*" element={<div>Ууппс, нет странички</div>} />
      </Routes>
    </BrowserRouter>
    
  </Provider>
);
