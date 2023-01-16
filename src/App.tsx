import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./Redux/store";

import AppBar from "./Components/MainPage/AppBar";
import LoginPage from "./Components/LoginPage/LoginPage";
import DeveloperPage from "./Components/DeveloperPage/DeveloperPage";
import PprTable from "./Components/PprTable/PprTable";
import Main from "./Components/MainPage/Main";

export default function App() {
  const user = useSelector((store: RootState) => store.user);
  return (
    <BrowserRouter>
      <Routes>
        {user.login && (
          <Route path="/" element={<AppBar />}>
            <Route path="" element={<Main />} />
            <Route path="ppr/:pprId" element={<PprTable />} />
            <Route path="developer" element={<DeveloperPage />} />
            <Route path="*" element={<div>Ууппс, нет странички</div>} />
          </Route>
        )}
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<div>Ууппс, нет странички</div>} />
      </Routes>
    </BrowserRouter>
  );
}
