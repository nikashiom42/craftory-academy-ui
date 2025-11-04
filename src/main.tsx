import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const loadFonts = async () => {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  const fontFaces = ["Datebashvili", "SS-GEO-HAKUNA"];
  const loaders = fontFaces.map((font) => document.fonts.load(`1em ${font}`));

  try {
    await Promise.all(loaders);
  } catch (error) {
    console.warn("Failed to preload custom fonts", error);
  }
};

const start = async () => {
  document.documentElement.classList.add("fonts-loading");
  await loadFonts();
  document.documentElement.classList.remove("fonts-loading");

  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
};

void start();
