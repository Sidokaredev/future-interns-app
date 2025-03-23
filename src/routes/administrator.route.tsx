import { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";
import { Authenticated } from "../loaders/authenticated";

const administratorPages: any = import.meta.glob("../pages/administrators/**/page.tsx");
const administratorLoading: any = import.meta.glob(
  "../pages/administrators/**/loading.tsx",
  {
    eager: true,
    import: "default",
  }
);

const administratorRoute: RouteObject[] = CreateDynamicRoute({
  pageComponent: administratorPages,
  loadingComponent: administratorLoading,
  loader: Authenticated,
});

export default administratorRoute;