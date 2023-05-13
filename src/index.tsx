import App from "app";
import "app/styles/index.scss";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { ThemeProvider } from "app/providers/theme/ThemeProvider";

import "shared/config/i18n/i18n";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <Suspense fallback="...loading">
        <App />
      </Suspense>
    </ThemeProvider>
  </BrowserRouter>
);
