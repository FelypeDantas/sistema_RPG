import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProgressionProvider } from "./providers/ProgressionProvider.tsx";
import { AchievementToastProvider } from "./providers/AchievementToastProvider.tsx";

createRoot(document.getElementById("root")!).render(
<ProgressionProvider>
  <AchievementToastProvider>
    <App />
  </AchievementToastProvider>
</ProgressionProvider>
);
