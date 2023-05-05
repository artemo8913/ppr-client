import { useState } from "react";
import { AppRoutes } from "./providers/routes/RoutesProvider";
import { useTheme } from "./providers/theme/ThemeProvider";

import { Top } from "widgets/Top";
import { Aside, AsideSwitcher } from "widgets/Aside";

import { AppLink } from "shared/ui/AppLink/AppLink";
import { pagesPaths } from "pages";

export default function App() {
  // Управление боковой панелью
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const toggle = () => setIsAsideOpen((prevState) => !prevState);
  // Текущая тема
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <Top>
        <AsideSwitcher isOpen={isAsideOpen} toggle={toggle} />
        <h1>Цифровая дистанция электроснабжения. ППР</h1>
      </Top>
      <div className="conteiner">
        <Aside additionalClassName="AsideLayout" isOpen={isAsideOpen}>
          <AppLink to={pagesPaths.main}>Главная страница</AppLink>
          <AppLink to={pagesPaths.about}>О странице</AppLink>
        </Aside>
        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}
