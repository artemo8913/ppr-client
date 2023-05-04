import { AppRoutes } from "./providers/routes/RoutesProvider";
import { useTheme } from "./providers/theme/ThemeProvider";
import { ThemeSwitcher } from "widgets/ThemeSwitcher";

export default function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <div>Header</div>
      <div>Aside</div>
      <ThemeSwitcher />
      <AppRoutes />
    </div>
  );
}
