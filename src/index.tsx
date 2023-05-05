import App from "app";
import "app/styles/index.scss";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "app/providers/theme/ThemeProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
