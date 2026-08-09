import { PastelConfigPage } from "@/components/PastelConfigPage";
import { PastelWidgetPage } from "@/components/PastelWidgetPage";

export function App() {
  const path = window.location.pathname.replace(/\/$/, "");
  const isWidget = path === "/widget" || path === "/pastel/widget";

  return isWidget ? <PastelWidgetPage /> : <PastelConfigPage />;
}
