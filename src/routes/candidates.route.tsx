import { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";

const candidatePages: any = import.meta.glob("../pages/candidates/**/page.tsx");
const candidateLoading: any = import.meta.glob(
  "../pages/candidates/**/loading.tsx",
  {
    eager: true,
    import: "default",
  }
);

const candidatesRoute: RouteObject[] = CreateDynamicRoute({
  pageComponent: candidatePages,
  loadingComponent: candidateLoading,
});

console.info("Route \t:", candidatesRoute);
export default candidatesRoute;
