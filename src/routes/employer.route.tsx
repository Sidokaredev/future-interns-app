import { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";
import { Authenticated } from "../loaders/authenticated";

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
  loader: Authenticated,
});

export default employersRoute;
