import { useState } from "react";
import { AppRoutes } from "./providers/routes/RoutesProvider";

import { Top } from "widgets/Top";
import { Sidebar } from "processes/Sidebar";

export default function App() {
  // Управление боковой панелью
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggle = () => setIsSidebarOpen((prevState) => !prevState);

  return (
    <div className="App">
      <Top isSidebarOpen={isSidebarOpen} toggleSidebar={toggle} />
      <div className="conteiner">
        <Sidebar additionalClassName="SidebarLayout" isOpen={isSidebarOpen} />
        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}
