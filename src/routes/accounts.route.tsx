/* Route */
import type { RouteObject } from "react-router-dom";
import { CreateDynamicRoute } from "./helpers";
import { Unauthenticated } from "../loaders/unauthenticated";

// const accountPages: any = import.meta.glob('../pages/accounts/**/page.tsx', { eager: true, import: 'default' })
const accountPages: any = import.meta.glob("../pages/accounts/**/page.tsx");
const accountLoadings: any = import.meta.glob(
  "../pages/accounts/**/loading.tsx",
  {
    eager: true,
    import: "default",
  }
);

const accountRoutes: RouteObject[] = CreateDynamicRoute({
  pageComponent: accountPages,
  loadingComponent: accountLoadings,
  loader: Unauthenticated,
  // privateLoader: {
  //   "/accounts/create": IdentityAccessCheck,
  // }
});

// const accountsRoute: RouteObject[] = Object.keys(accountPages).map((path) => {
//   const AccountsComponent = React.lazy(accountPages[path]);
//   /* Route Path */
//   const AccountsRoutePath = path
//     .replace("../pages", "")
//     .replace("/page", "")
//     .replace(/\.(tsx|jsx)$/, "")
//     .replace(/\[([^\]]+)\]/g, ":$1");
//   return {
//     path: AccountsRoutePath,
//     element: (
//       <Suspense fallback={<BaseLoading />}>
//         <AccountsComponent />
//       </Suspense>
//     ),
//   };
// });

export default accountRoutes;
