import { AppRoutes } from "./providers/routes/RoutesProvider";
import { useTheme } from "./providers/theme/ThemeProvider";

import { Top } from "widgets/Top";
import { Aside } from "widgets/Aside";

export default function App() {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <Top additionalClassName="Top" />
      <div className="conteiner">
        <Aside additionalClassName="Aside" />
        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}
