import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";

const LOCAL_STORAGE_KEY = "theme";

enum themesEnum {
  LIGHT = "app_light",
  DARK = "app_dark",
}

interface ThemeContextProps {
  theme?: themesEnum;
  setTheme?: (theme: themesEnum) => void;
}

const defaultTheme = localStorage.getItem(LOCAL_STORAGE_KEY) || themesEnum.LIGHT;

const themeContext = createContext<ThemeContextProps>({});

function useTheme(): ThemeContextProps {
  const themeContextValue = useContext(themeContext);
  return { ...themeContextValue };
}

function ThemeProvider(props: PropsWithChildren) {
  const [theme, setTheme] = useState<themesEnum>(defaultTheme as themesEnum);

  const changeTheme = (theme: themesEnum) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    setTheme(theme);
  };

  const defaultValue: ThemeContextProps = useMemo(
    () => ({
      theme,
      setTheme: changeTheme,
    }),
    [theme]
  );
  document.body.className = theme;
  return <themeContext.Provider value={defaultValue}>{props.children}</themeContext.Provider>;
}

export { themesEnum, ThemeProvider, useTheme, themeContext };
