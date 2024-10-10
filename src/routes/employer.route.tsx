import { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";

const employersPages: any = import.meta.glob("../pages/employers/**/page.tsx");
const employersLoading: any = import.meta.glob(
  "../pages/employers/**/loading.tsx",
  {
    eager: true,
    import: "default",
  }
);

const employersRoute: RouteObject[] = CreateDynamicRoute({
  pageComponent: employersPages,
  loadingComponent: employersLoading,
});

console.info("Route \t:", employersRoute);
export default employersRoute;
