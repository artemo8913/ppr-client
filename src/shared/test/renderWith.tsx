import { render } from "@testing-library/react";
import { ThemeProvider } from "app/providers/theme/ThemeProvider";
import { pagesPaths } from "pages";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import i18n from "shared/i18n/i18nForTest";
import { I18nextProvider } from "react-i18next";

function renderWith(component: ReactNode) {
  return render(
    <MemoryRouter initialEntries={[pagesPaths.main]}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
export { renderWith };
