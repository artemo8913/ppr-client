import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppBar from "./Components/MainPage/AppBar";
import LoginPage from "./Components/LoginPage/LoginPage";
import DeveloperPage from "./Components/DeveloperPage/DeveloperPage";
import PprTable from "./Components/PprTable/PprTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AppBar />}>
          <Route path="ppr" element={<PprTable />} />
          <Route path="developer" element={<DeveloperPage />} />
          <Route path="*" element={<div>Ууппс, нет странички</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
