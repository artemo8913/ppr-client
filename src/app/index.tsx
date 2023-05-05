import { AppRoutes } from "./providers/routes/RoutesProvider";
import { useTheme } from "./providers/theme/ThemeProvider";

import { Top } from "widgets/Top";

export default function App() {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <Top className="Top"/>
      <div className="conteiner">
        <div className="Aside">Aside</div>
        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}
