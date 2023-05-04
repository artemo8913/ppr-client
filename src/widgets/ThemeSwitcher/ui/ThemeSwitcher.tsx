import { useTheme, themesEnum } from "app/providers/theme/ThemeProvider";

function ThemeSwitcher() {
  const { theme: currentTheme, setTheme } = useTheme();
  const newTheme = currentTheme === themesEnum.LIGHT ? themesEnum.DARK : themesEnum.LIGHT;
  const switchTheme = () => {
    setTheme(newTheme);
  };
  return <button onClick={switchTheme}>Поменять тему</button>;
}
export {ThemeSwitcher};
