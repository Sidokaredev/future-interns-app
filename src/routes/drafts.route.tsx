import { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";

const DraftsPages: any = import.meta.glob("../pages/drafts/**/page.tsx");
const DraftsLoading: any = import.meta.glob("../pages/drafts/**/loading.tsx", {
  eager: true,
  import: "default",
});

const DraftsRoutes: RouteObject[] = CreateDynamicRoute({
  pageComponent: DraftsPages,
  loadingComponent: DraftsLoading,
});

export default DraftsRoutes;
